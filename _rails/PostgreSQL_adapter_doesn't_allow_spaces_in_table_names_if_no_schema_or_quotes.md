---
title: PostgreSQL adapter doesn't allow spaces in table names if no schema or quotes
labels: PostgreSQL, activerecord, stale
layout: issue
---

### Steps to reproduce

Create, attempt to use, or schema-dump a PostgreSQL table with a space in the name, e.g. `create_table 'work orders'`.
### Expected behavior

It should treat the entire string as the table name.
### Actual behavior

It uses the first word or segment before the space as the schema, and the rest as the table name.

This is a bug in the regex used for parsing the schema/table name. You can work around it by using quotes (`"work orders"`), which is reasonable and necessary when you specify a schema ('"my_schema"."work orders"). It is not necessary for the mysql or sqlite adapters, though, and causes friction when you don't use schemas.
### System configuration

**Rails version**: tested with 4.2.7 and master, probably introduced [here](https://github.com/rails/rails/commit/5c7f8c929b228063b224eaa17360dcc105788296)

**Ruby version**: 2.3.1

