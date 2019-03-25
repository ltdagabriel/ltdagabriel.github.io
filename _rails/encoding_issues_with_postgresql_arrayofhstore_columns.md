---
title: encoding issues with postgresql array-of-hstore columns
labels: PostgreSQL, activerecord, attached PR
layout: issue
---

With the new postgresql magic, we can create arrays of hstore columns but they don't quite work due to incorrect encoding, storing values throws the following error from the database:

```
ActiveRecord::StatementInvalid: PG::Error: ERROR:  malformed array literal
```

Which is a pity because being able to store an array of arbitrary key,value pairs seems terribly useful.

Demo at https://gist.github.com/inopinatus/5930884 which barfs at line 57 (where it says "boom!"), and fix that works for me in pull request https://github.com/rails/rails/pull/11444

