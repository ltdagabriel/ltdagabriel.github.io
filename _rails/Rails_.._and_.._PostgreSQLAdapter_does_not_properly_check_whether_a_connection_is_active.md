---
title: Rails 4.0.0 and 4.0.1 PostgreSQLAdapter does not properly check whether a connection is active
labels: PostgreSQL, activerecord, openacademy
layout: issue
---

TL;DR: Rails 4's PostgreSQLAdapter does not properly check whether a connection has died or not because `connect_poll` does not detect if the underlying TCP socket has closed. 

Rails 4.0.0 and 4.0.1 do not properly detect whether a PostgreSQL connection still alive or not before using it. A previously good connection that has been disconnected by the remote server or by an intermediate proxy will not be detected by rails, which will result in queries failing. An example error that we ran into:

```
    PG::UnableToSend: SSL SYSCALL error: EOF detected

    activerecord-4.0.1/lib/active_record/connection_adapters/postgresql_adapter.rb:774→ exec
    activerecord-4.0.1/lib/active_record/connection_adapters/postgresql_adapter.rb:774→ exec_no_cache
    activerecord-4.0.1/lib/active_record/connection_adapters/postgresql/database_statements.rb:138→ block in exec_query
    activerecord-4.0.1/lib/active_record/connection_adapters/abstract_adapter.rb:435→ block in log
    activesupport-4.0.1/lib/active_support/notifications/instrumenter.rb:20→ instrument
    activerecord-4.0.1/lib/active_record/connection_adapters/abstract_adapter.rb:430→ log
    activerecord-4.0.1/lib/active_record/connection_adapters/postgresql/database_statements.rb:137→ exec_query
    activerecord-4.0.1/lib/active_record/connection_adapters/postgresql_adapter.rb:921→ column_definitions
    activerecord-4.0.1/lib/active_record/connection_adapters/postgresql/schema_statements.rb:174→ columns
    activerecord-4.0.1/lib/active_record/connection_adapters/schema_cache.rb:114→ block in prepare_default_proc
    activerecord-4.0.1/lib/active_record/connection_adapters/schema_cache.rb:56→ yield
    activerecord-4.0.1/lib/active_record/connection_adapters/schema_cache.rb:56→ columns
    activerecord-4.0.1/lib/active_record/model_schema.rb:208→ columns
    activerecord-4.0.1/lib/active_record/model_schema.rb:217→ columns_hash
    activerecord-4.0.1/lib/active_record/relation/delegation.rb:14→ columns_hash
    activerecord-4.0.1/lib/active_record/relation/finder_methods.rb:278→ find_one
    activerecord-4.0.1/lib/active_record/relation/finder_methods.rb:268→ find_with_ids
    activerecord-4.0.1/lib/active_record/relation/finder_methods.rb:35→ find
    activerecord-deprecated_finders-1.0.3/lib/active_record/deprecated_finders/relation.rb:122→ find
    activerecord-4.0.1/lib/active_record/relation.rb:334→ update
    activerecord-4.0.1/lib/active_record/querying.rb:7→ update
    (our controller method)
    ...
```

This error began occurring when we began using Rails 4.0.0 and 4.0.1 instead of Rails 3.2.15. Our database connections were being terminated by an HAProxy in our setup that terminates idle TCP connections, which Rails 3.2 had no issue with --- it would detect the dead connection and establish a new connection without issue. Rails 4 on the other hand does not. A subsequent request cycle caused a new connection to be created, which would then work as long as that connection was not killed as well.

It turns out, [Rails already has a unit test to verify that a dead connection is properly detected](https://github.com/rails/rails/blob/v4.0.1/activerecord/test/cases/adapters/postgresql/connection_test.rb#L91), but it is "skipped" by default because it requires a human to manually restart the PostgreSQL database (although there are ways this could be automated). When ActiveRecord::PostgresqlConnectionTest#test_reconnection_after_actual_disconnection_with_verify is run in Rails 4.0.1:

```
cd activerecord
$EDITOR test/config.yml # Set with_manual_interventions to true instead of false
ARCONN=postgresql ruby -Itest test/cases/adapters/postgresql/connection_test.rb
```

It fails, along with the tests performed after it.

The above error, as well as the failed test, are caused by PostgreSQLAdapter not properly discovering when the underlying TCP connection closes: libpq ran into an EOF, which occurs if the underlying TCP socket has closed. 

When the connection pool determines whether a given database connection is still valid, it calls [PostgreSQLAdapter#active?](https://github.com/rails/rails/blob/v4.0.1/activerecord/lib/active_record/connection_adapters/postgresql_adapter.rb#L567):

``` ruby
      # Is this connection alive and ready for queries?
      def active?
        @connection.connect_poll != PG::PGRES_POLLING_FAILED
      rescue PGError
        false
      end
```

Ruby-pg's `PGConn#connect_poll` is a thin wrapper around `PQconnectPoll()` from libpq. However, `PQconnectPoll()` is meant for setting up a Postgres client connection in a non-blocking manner after the connection's socket is ready for reading/writing (as determined by `select()` or `poll()`) --- it does not actually perform any health checks on the connection. In fact, if the last known state of the connection is good, it immediately returns:

([From src/interface/libpq/fe-connect.c in the postgresql source](http://git.postgresql.org/gitweb/?p=postgresql.git;a=blob;f=src/interfaces/libpq/fe-connect.c;h=18fcb0c23724c7344f62f36adcb4f5ef9b0c73dc;hb=HEAD#l1553))

``` C
PostgresPollingStatusType
PQconnectPoll(PGconn *conn)
{
    PGresult   *res;
    char        sebuf[256];
    int         optval;

    if (conn == NULL)
        return PGRES_POLLING_FAILED;

    /* Get the new data */
    switch (conn->status)
    {
            /*
             * We really shouldn't have been polled in these two cases, but we
             * can handle it.
             */
        case CONNECTION_BAD:
            return PGRES_POLLING_FAILED;
        case CONNECTION_OK:
            return PGRES_POLLING_OK;

...
```

This means that `connect_poll` is not sufficient for detecting an inactive connection that has been closed by the other end. [The Rails 3.2.15 version of `active?`](https://github.com/rails/rails/blob/v3.2.15/activerecord/lib/active_record/connection_adapters/postgresql_adapter.rb#L341) successfully detects the lost TCP connection by actually performing a database query, which exercises the connection and would fail if the connection were terminated:

``` ruby
      # Is this connection alive and ready for queries?
      def active?
        @connection.query 'SELECT 1'
        true
      rescue PGError
        false
      end
```

This code change was introduced in https://github.com/rails/rails/commit/34c7e73c1def1312e59ef1f334586ff2f668246e 
## To Fix

There is no easy way to determine if a TCP socket is dead other than by trying to use the connection (as was done in Rails 3.2.15 and earlier, and is also still used by the mysql adapters).

Traditionally, a remotely closed TCP connection can be detected by calling `recv` on the socket. If recv returns a string of length 0, then the remote side has closed the connection. If the socket is non-blocking but has not been closed, it will return an EAGAIN error. However, this approach does not work if there is data buffered on the TCP stream. I attempted to come up with a fix that uses `recv_nonblock` to peek ahead in the stream:

``` ruby
      def socket_alive?
        socket = Socket.for_fd(@connection.socket)
        socket.autoclose = false
        socket.recv_nonblock(1, Socket::MSG_PEEK) != ''
      rescue Errno::EAGAIN
        true
      end

      # Is this connection alive and ready for queries?
      def active?
        socket_alive? && @connection.connect_poll != PG::PGRES_POLLING_FAILED
      rescue PGError
        false
      end
```

However, if the server closes the connection, as it does during `test_reconnection_after_actual_disconnection_with_verify`, it sends a final message to the client that won't have been consumed yet when `socket_alive?` runs:

```
[3] pry(#<ActiveRecord::ConnectionAdapters::PostgreSQLAdapter>)> socket.recv_nonblock(1000, Socket::MSG_PEEK)
=> "E\x00\x00\x00mSFATAL\x00C57P01\x00Mterminating connection due to administrator command\x00Fpostgres.c\x00L2855\x00RProcessInterrupts\x00\x00"
```

There is actually a deeper problem here involving a time-of-check-to-time-of-use (TOCTTOU) weakness where the connection might die after checking the connection but before trying to use it. A better solution would be to detect the dead connection while trying to use it, and to then attempt to reestablish the connection when it dies. ActiveRecord should only let the error bubble up if the reconnect attempt fails.

