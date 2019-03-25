---
title: rake db:test:prepare tries to load the structure.sql into development database
labels: activerecord, regression
layout: issue
---

The last revision of 3-2-stable branch - commit 7f09bcd1810f - drops, creates the test database, but the structure is loaded into development one.

A snippet from PostgreSQL log:

```
[case mz_test] FATAL:  database "mz_test" does not exist
[case postgres] LOG:  duration: 7211.694 ms  statement: CREATE DATABASE "mz_test" ENCODING = 'unicode'
[case mz_devel] ERROR:  must be owner of extension plpgsql
[case mz_devel] STATEMENT:  COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';
[..]
[case mz_devel] ERROR:  relation "cards" already exists
[case mz_devel] STATEMENT:  CREATE TABLE cards (

```

and so on..

I am looking for the exact commit somewhere between commit 45d78a3dd1a1 and 7f09bcd1810f where the problem has been introduced.

