---
title: PostgreSQLAdapter, extract_table_ref_from_insert_sql (multiline sql issue)
labels: activerecord
layout: issue
---

ActiveRecord version 4.0.2
lib/active_record/connection_adapters/postgresql_adapter.rb
def extract_table_ref_from_insert_sql(sql) - line 942

Code of method "extract_table_ref_from_insert_sql" works not if sql includes multiline value, for example:
adapter.insert_sql(<<-SQL)
  INSERT INTO table1 (
    ...
  ) VALUES (
    ...
  )
SQL

For such sql this method can't detect table name and insert_sql method returns nil value.

