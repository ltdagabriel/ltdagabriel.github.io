---
title: Add database extension support to schema.rb
labels: activerecord
layout: issue
---

Postgresql's database connection supports [enabling extensions](https://github.com/rails/rails/blob/master/activerecord/lib/active_record/connection_adapters/postgresql_adapter.rb#L588-592), so you can [enable an extension in your migrations](https://github.com/rails/rails/blob/master/activerecord/test/cases/adapters/postgresql/hstore_test.rb#L14-17).

The problem is that any enabled extensions are not written to schema.rb, so the development database cannot be copied to test unless you use a SQL schema.

I want any enabled extensions to be written to `schema.rb` so that PG users don't have to switch to SQL dumping when they enable an extension.

