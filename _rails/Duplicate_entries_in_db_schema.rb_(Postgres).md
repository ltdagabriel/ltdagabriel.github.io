---
title: Duplicate entries in db/schema.rb (Postgres)
labels: PostgreSQL, activerecord, stale
layout: issue
---

When a schema.rb dump is created from a Postgres database containing multiple schemas, duplicate statements will be generated in db/schema.rb, which will cause errors when loading the schema.rb.

