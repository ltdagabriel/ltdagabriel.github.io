---
title: SQLite schema changes lose foreign key references
labels: With reproduction steps, activerecord
layout: issue
---

### Steps to reproduce

Run a migration with schema change (anything using `alter_table`) on a SQLite database, e.g. renaming a column which has a foreign key reference set.

### Expected behavior
The column is renamed, the foreign key reference is kept.

### Actual behavior
The column is renamed, the foreign key reference is dropped. This happens on all schema changes which copy the table. The logic to recreate the foreign key in `create_table` seems to be missing.

```
$ sqlite3 test.db
sqlite> CREATE TABLE foo (id INTEGER PRIMARY KEY NOT NULL);
sqlite> CREATE TABLE bar (id INTEGER PRIMARY KEY NOT NULL, foo_id INTEGER NOT NULL REFERENCES foo (id));
sqlite> ^D
$  echo ".schema bar" | sqlite3 test.db
CREATE TABLE bar (id INTEGER PRIMARY KEY NOT NULL, foo_id INTEGER NOT NULL REFERENCES foo (id));

$ bundle exec irb
2.4.1 :001 > require 'active_record'
2.4.1 :002 > ActiveRecord::Base.logger = Logger.new(STDOUT)
2.4.1 :003 > ActiveRecord::Base.establish_connection(adapter:  'sqlite3', database: 'test.db')
2.4.1 :004 > ActiveRecord::Base.connection.rename_column('bar', 'foo_id', 'new_foo_id')
D, [2018-08-02T17:22:54.949390 #4638] DEBUG -- :    (3.4ms)  SELECT sqlite_version(*)
D, [2018-08-02T17:22:54.953112 #4638] DEBUG -- :    (0.1ms)  begin transaction
D, [2018-08-02T17:22:54.953342 #4638] DEBUG -- :    (0.1ms)  PRAGMA foreign_keys
D, [2018-08-02T17:22:54.953501 #4638] DEBUG -- :    (0.1ms)  PRAGMA defer_foreign_keys
D, [2018-08-02T17:22:54.953658 #4638] DEBUG -- :    (0.1ms)  PRAGMA defer_foreign_keys = ON
D, [2018-08-02T17:22:54.953794 #4638] DEBUG -- :    (0.1ms)  PRAGMA foreign_keys = OFF
D, [2018-08-02T17:22:54.954766 #4638] DEBUG -- :    (0.2ms)  CREATE TEMPORARY TABLE "abar" ("id" integer NOT NULL PRIMARY KEY, "new_foo_id" integer NOT NULL)
D, [2018-08-02T17:22:54.955253 #4638] DEBUG -- :    (0.1ms)  INSERT INTO "abar" ("id","new_foo_id")
                     SELECT "id","foo_id" FROM "bar"
D, [2018-08-02T17:22:54.955792 #4638] DEBUG -- :    (0.4ms)  DROP TABLE "bar"
D, [2018-08-02T17:22:54.958514 #4638] DEBUG -- :    (0.2ms)  CREATE TABLE "bar" ("id" integer NOT NULL PRIMARY KEY, "new_foo_id" integer NOT NULL)
D, [2018-08-02T17:22:54.958976 #4638] DEBUG -- :    (0.1ms)  INSERT INTO "bar" ("id","new_foo_id")
                     SELECT "id","new_foo_id" FROM "abar"
D, [2018-08-02T17:22:54.959140 #4638] DEBUG -- :    (0.1ms)  DROP TABLE "abar"
D, [2018-08-02T17:22:54.974059 #4638] DEBUG -- :    (0.1ms)  PRAGMA defer_foreign_keys = 0
D, [2018-08-02T17:22:54.974243 #4638] DEBUG -- :    (0.1ms)  PRAGMA foreign_keys = 1
D, [2018-08-02T17:22:54.975261 #4638] DEBUG -- :    (0.9ms)  commit transaction
2.4.1 :005 > ^D

$ echo ".schema bar" | sqlite3 test.db
CREATE TABLE IF NOT EXISTS "bar" ("id" integer NOT NULL PRIMARY KEY, "new_foo_id" integer NOT NULL);
```

### System configuration
**Rails version**:

master (78992d6f6dfebb5275b5e3b886aeb6908cbe1acb)

**Ruby version**:

2.4.1

