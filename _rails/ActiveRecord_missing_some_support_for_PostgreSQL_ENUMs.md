---
title: ActiveRecord missing some support for PostgreSQL ENUMs
labels: PostgreSQL, activerecord
layout: issue
---

Bugs I've noticed:
- If a enum type contains the phrase 'int' in it (i.e. if the type is named "certainty"), AR thinks it's an integer.
- The `type` method for the column is nil, I think it should be string?
- Defaults for columns of an enum type don't work

Failing tests for these:

For 3.2 stable: https://github.com/joevandyk/rails/commit/4374e11708100184c4e46d53fd11115beb5f51df

For master: https://github.com/joevandyk/rails/commit/3cf3ea097927fa7ee6f6d1628afb9aec01ac702e

https://github.com/RISCfuture/enum_type/blob/master/lib/enum_type/extensions.rb is some code to set the default value for enum columns.

