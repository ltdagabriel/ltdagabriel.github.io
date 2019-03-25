---
title: table_exists? returns incorrect results on MySQL
labels: activerecord, attached PR
layout: issue
---

`table_exists?` can return incorrect results on MySQL if you have tables with `LIKE` metacharaters in their names.

I'm attempting to load a legacy schema, and there's a number of odd naming conventions going on. Most table names end in an underscore (for _reasons_), which causes `table_exists?` to sometimes return true when it shouldn't - breaking things like `force: true` in migrations.

For concreteness, imagine we have a table called `Foos` and another called `foo_` (not their real names :) ). The `create_table` for Foos executes without incident, but the one for `foo_` blows up with 'Unknown table 'foo_': DROP TABLE 'foos_'`.

Under the hood, calling `ActiveRecord::Base.connection.table_exists?('foo_')` runs the following SQL:

```
SHOW TABLES LIKE 'foo_'
```

which, thanks to MySQL's case-insensitive matching and `_` meaning "match any single character`, successfully finds the`Foos` table.

The `LIKE` behavior was introduced in https://github.com/rails/rails/commit/38703ac8972c7e8f3f3f1ac95aa506cc4ae30ef0 back in 2011. My guess is that `LIKE` was used because `SHOW TABLES` doesn't have a particularly clean way to select an exact-match table. @jonleighton may remember more.

I can think of two possibilities for fixing this:
- escape `LIKE` metacharacters in the `tables` function. No idea if anybody's actually expecting to be able to pass them, though.
- do a more-detailed query against `information_schema.tables`. This only works on MySQL 5.0 or higher, but I believe the API adapter gems also enforce this minimum version.

I have a patch, but need to get it working with the existing AR tests etc.

