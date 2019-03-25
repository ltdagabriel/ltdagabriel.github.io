---
title: t.hstore from change_table is not reversible
labels: PostgreSQL, activerecord
layout: issue
---

produces `undefined method 'hstore' for #<ActiveRecord::ConnectionAdapters::Table` on rollback

