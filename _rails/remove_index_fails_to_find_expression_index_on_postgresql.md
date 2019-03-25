---
title: remove_index fails to find expression index on postgresql
labels: activerecord, attached PR
layout: issue
---

### Steps to reproduce

``` ruby
require 'bundler/setup'
require 'active_record'
ActiveRecord::Base.establish_connection("postgres://postgres@localhost:5432/test")
ActiveRecord::Base.connection.tap do |conn|
  conn.create_table(:a_table) { |t| t.text :a_column }
  conn.exec_query 'CREATE INDEX expr_index ON a_table (LOWER(a_column))'
  conn.remove_index :a_table, name: :expr_index
end
```
### Expected behavior

The index should be removed. Works correctly in Rails 4.1 and 4.2, but not Rails 5.
### Actual behavior

```
ArgumentError:
  No indexes found on a_table with the options provided.
```
### System configuration

**Rails version**: 5.0.0.beta3

**Ruby version**: MRI 2.3.0

