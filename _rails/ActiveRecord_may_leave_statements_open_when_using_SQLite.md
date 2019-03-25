---
title: ActiveRecord may leave statements open when using SQLite3
labels: activerecord, stale
layout: issue
---

Simple repro test case (works on Linux -- not sure how to test on other systems, as I don't know how to figure out which processes are holding a lock on a file):

I setup a simple table called "Status" with string columns "name" and "value". After that, open two rails consoles. In both consoles execute:

<pre>
ActiveRecord::Base.transaction do Status.put('test', Time.now); sleep(15) end
</pre>


One of the requests will fail as it will fail to acquire a WRITE lock on the file -- which is ok, however, after the failure, the state of the locks on the database is as follows:

<pre>
13: POSIX  ADVISORY  READ  8799 08:03:11436 1073741826 1073742335
</pre>


There is an open READ lock against SQLite3 file, which locks out any writes to the database on the system.

The actual bug is here:
active_record/lib/active_record/connection_adapters/sqlite3_adapter.rb:

<pre>
291       def exec_query(sql, name = nil, binds = [])
[...]
296             stmt    = @connection.prepare(sql)
297             cols    = stmt.columns
298             records = stmt.to_a
299             stmt.close
[...]
315       end
</pre>


sqlite3_step() may raise an exception (for example, a BusyException -- http://www.sqlite.org/c3ref/step.html) and the statement is _never_ closed (<code>sqlite3_step()</code> is called when <code>stmt.to_a</code> is called). I will submit a pull request to place a <code>begin/end</code> block around line 298 and place the close into the <code>ensure</code> block. This bug affects AR 4.0 and 3.2.xx. I have not checked the source code for other versions.

