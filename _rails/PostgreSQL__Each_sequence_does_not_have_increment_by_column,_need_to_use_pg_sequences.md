---
title: PostgreSQL 10 : Each sequence does not have `increment_by` column, need to use `pg_sequences`
labels: PostgreSQL, activerecord, attached PR
layout: issue
---

#### Environment:
```
$ more /etc/redhat-release
Fedora release 25 (Twenty Five)
```
* Enable PostgreSQL 10 repository https://yum.postgresql.org/repopackages.php#pg10
```
$ rpm -qa |grep postgresql10
postgresql10-contrib-10.0-20170414_1PGDG.f25.2.x86_64
postgresql10-10.0-20170414_1PGDG.f25.2.x86_64
postgresql10-devel-10.0-20170414_1PGDG.f25.2.x86_64
postgresql10-server-10.0-20170414_1PGDG.f25.2.x86_64
postgresql10-libs-10.0-20170414_1PGDG.f25.2.x86_64
$
```

* Ruby and bundler version
```
$ ruby -v
ruby 2.4.1p111 (2017-03-22 revision 58053) [x86_64-linux]
```

```ruby
$ bundle show |grep pg
  * pg (0.19.0)
```

#### Steps to reproduce:
```
$ git clone https://github.com/rails/rails.git
$ cd rails/activerecord
$ bundle exec rake db:postgresql:build
$ ARCONN=postgresql bundle exec ruby -w -Itest test/cases/primary_keys_test.rb -n test_read_attribute_with_custom_primary_key

```
#### Results:

```ruby
$ ARCONN=postgresql bundle exec ruby -w -Itest test/cases/primary_keys_test.rb -n test_read_attribute_with_custom_primary_key
/home/yahonda/git/rails/activesupport/lib/active_support/core_ext/enumerable.rb:20: warning: method redefined; discarding old sum
Using postgresql
Run options: -n test_read_attribute_with_custom_primary_key --seed 6500

# Running:

E

Finished in 0.050451s, 19.8212 runs/s, 0.0000 assertions/s.

  1) Error:
PrimaryKeysTest#test_read_attribute_with_custom_primary_key:
ActiveRecord::StatementInvalid: PG::UndefinedColumn: ERROR:  column "increment_by" does not exist
LINE 1: ...pics_id_seq"', (SELECT COALESCE(MAX("id")+(SELECT increment_...
                                                             ^
:               SELECT setval('"public"."topics_id_seq"', (SELECT COALESCE(MAX("id")+(SELECT increment_by FROM "public"."topics_id_seq"), (SELECT min_value FROM "public"."topics_id_seq")) FROM "topics"), false)

    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/postgresql_adapter.rb:613:in `async_exec'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/postgresql_adapter.rb:613:in `block (2 levels) in exec_no_cache'
    /home/yahonda/git/rails/activesupport/lib/active_support/dependencies/interlock.rb:46:in `block in permit_concurrent_loads'
    /home/yahonda/git/rails/activesupport/lib/active_support/concurrency/share_lock.rb:185:in `yield_shares'
    /home/yahonda/git/rails/activesupport/lib/active_support/dependencies/interlock.rb:45:in `permit_concurrent_loads'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/postgresql_adapter.rb:612:in `block in exec_no_cache'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:580:in `block (2 levels) in log'
    /home/yahonda/.rbenv/versions/2.4.1/lib/ruby/2.4.0/monitor.rb:214:in `mon_synchronize'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:579:in `block in log'
    /home/yahonda/git/rails/activesupport/lib/active_support/notifications/instrumenter.rb:21:in `instrument'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:571:in `log'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/postgresql_adapter.rb:611:in `exec_no_cache'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/postgresql_adapter.rb:598:in `execute_and_clear'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/postgresql/database_statements.rb:182:in `select_result'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/postgresql/database_statements.rb:11:in `select_value'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/postgresql/schema_statements.rb:285:in `reset_pk_sequence!'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:578:in `block (3 levels) in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:559:in `each'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:559:in `block (2 levels) in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:225:in `block in transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/transaction.rb:194:in `block in within_new_transaction'
    /home/yahonda/.rbenv/versions/2.4.1/lib/ruby/2.4.0/monitor.rb:214:in `mon_synchronize'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/transaction.rb:191:in `within_new_transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:225:in `transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:557:in `block in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/postgresql/referential_integrity.rb:41:in `block in disable_referential_integrity_with_alter_constraint'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:225:in `block in transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/transaction.rb:194:in `block in within_new_transaction'
    /home/yahonda/.rbenv/versions/2.4.1/lib/ruby/2.4.0/monitor.rb:214:in `mon_synchronize'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/transaction.rb:191:in `within_new_transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:225:in `transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/postgresql/referential_integrity.rb:38:in `disable_referential_integrity_with_alter_constraint'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/postgresql/referential_integrity.rb:12:in `disable_referential_integrity'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:542:in `create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:1049:in `load_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:986:in `setup_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:870:in `before_setup'

1 runs, 0 assertions, 0 failures, 1 errors, 0 skips
$
```

#### Additional information:

It looks this behavior change is introduced by [Add pg_sequence system catalog](https://github.com/postgres/postgres/commit/1753b1b027035029c2a2a1649065762fafbf63f3)

* PostgreSQL version

```sql
activerecord_unittest=# select version();
                                                  version
-----------------------------------------------------------------------------------------------------------
 PostgreSQL 10devel on x86_64-pc-linux-gnu, compiled by gcc (GCC) 6.3.1 20161221 (Red Hat 6.3.1-1), 64-bit
(1 row)
```

* Each sequence does not have `increment_by`

```sql
activerecord_unittest=# select * FROM "public"."topics_id_seq";
 last_value | log_cnt | is_called
------------+---------+-----------
        100 |       0 | t
(1 row)

activerecord_unittest=#
```

* Now `pg_sequences` has it

```
activerecord_unittest=# select increment_by from pg_sequences where schemaname = 'public' and sequencename = 'topics_id_seq';
 increment_by
--------------
            1
(1 row)

activerecord_unittest=#
```

