---
title: postgresql adapter : primary_key method fails on table with capital letters
labels: activerecord
layout: issue
---

The table name is not quoted in the `primary_key` method (quoting has been removed at a certain point : https://github.com/rails/rails/commit/1d7c751bf703c729887e2d8a9ae104a8e6aef010#L0L867) and it causes the primary_key method to fail on tables named with capital letters with the following error :

```
1.9.3-p125 :003 > ActiveRecord::Base.connection.primary_key 'CustomUser'
ActiveRecord::StatementInvalid: PGError: ERROR:  relation "customuser" does not exist
:           SELECT DISTINCT(attr.attname)
      FROM pg_attribute attr
      INNER JOIN pg_depend dep ON attr.attrelid = dep.refobjid AND attr.attnum = dep.refobjsubid
      INNER JOIN pg_constraint cons ON attr.attrelid = cons.conrelid AND attr.attnum = cons.conkey[1]
      WHERE cons.contype = 'p'
        AND dep.refobjid = $1::regclass
```

