---
title: No extensions in structure.sql when schema_search_path is defined
labels: PostgreSQL, activerecord
layout: issue
---

The rake task `db:structure:dump` is running [this](https://github.com/rails/rails/blob/9c6c5aa9297883cea779839299b08a2ee4548856/activerecord/lib/active_record/tasks/postgresql_database_tasks.rb#L54) command to dump to database schema to the structure.sql file. There is a problem though, when schema_search_path is defined. When passing `--schema` flags to pg_dump extensions are skipped (not sure why) no matter which schema they live on. 

I am using the pg_trgm extension (and others) and I have indexes that use this extension. Commands to create those indexes are dumped in the file but the extension itself is missing. This way rake tasks that create the test database generate errors (non blocking though). If I remove the `--schema` flags from the pg_dump command everything is dumped correctly but I'm not sure if that will suit everybody. 

Versions:
Postgres 9.3.5
Rails 4.0.10

