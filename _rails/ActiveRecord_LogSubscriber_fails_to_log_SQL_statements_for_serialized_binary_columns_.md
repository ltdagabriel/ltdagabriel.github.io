---
title: ActiveRecord::LogSubscriber fails to log SQL statements for serialized binary columns 
labels: With reproduction steps, activerecord, attached PR
layout: issue
---

### Steps to reproduce

This model (and migration) create a model with a serialized column (`preferences`), backed by a `binary` column type: 

``` ruby
class Broken < ActiveRecord::Base
  serialize :preferences
end

class CreateBrokens < ActiveRecord::Migration
  def change
    create_table :brokens do |t|
      t.binary :preferences

      t.timestamps null: false
    end
  end
end
```

When you create a new instance, e.g.:

``` ruby
Broken.create(preferences: {a: 1})
```

Rails 4.2 logs the SQL insert statement. With Rails 5.0.0.beta1, this logs an internal exception.
### Expected behavior

The serialized column is appropriately transformed for the log, e.g.:

>  SQL (1.3ms)  INSERT INTO "brokens" ("preferences", "created_at", "updated_at") VALUES (?, ?, ?)  [["preferences", "<77 bytes of binary data>"], ["created_at", "2016-05-10 16:19:18.665828"], ["updated_at", "2016-05-10 16:19:18.665828"]]
### Actual behavior

An exception is logged:

> Could not log "sql.active_record" event. NoMethodError: undefined method `bytesize' for {:a=>1}:Hash

```
.../activerecord-5.0.0.beta1/lib/active_record/log_subscriber.rb:25:in `render_bind'
.../activerecord-5.0.0.beta1/lib/active_record/log_subscriber.rb:47:in `block in sql'
.../activerecord-5.0.0.beta1/lib/active_record/log_subscriber.rb:47:in `map'
.../activerecord-5.0.0.beta1/lib/active_record/log_subscriber.rb:47:in `sql'
.../activesupport-5.0.0.beta1/lib/active_support/subscriber.rb:95:in `finish'
.../activesupport-5.0.0.beta1/lib/active_support/log_subscriber.rb:83:in `finish'
.../activesupport-5.0.0.beta1/lib/active_support/notifications/fanout.rb:102:in `finish'
.../activesupport-5.0.0.beta1/lib/active_support/notifications/fanout.rb:46:in `block in finish'
.../activesupport-5.0.0.beta1/lib/active_support/notifications/fanout.rb:46:in `each'
.../activesupport-5.0.0.beta1/lib/active_support/notifications/fanout.rb:46:in `finish'
.../activesupport-5.0.0.beta1/lib/active_support/notifications/instrumenter.rb:42:in `finish_with_state'
.../activesupport-5.0.0.beta1/lib/active_support/notifications/instrumenter.rb:26:in `instrument'
.../activerecord-5.0.0.beta1/lib/active_record/connection_adapters/abstract_adapter.rb:529:in `log'
.../activerecord-5.0.0.beta1/lib/active_record/connection_adapters/sqlite3_adapter.rb:241:in `exec_query'
.../activerecord-5.0.0.beta1/lib/active_record/connection_adapters/abstract/database_statements.rb:87:in `exec_insert'
.../activerecord-5.0.0.beta1/lib/active_record/connection_adapters/abstract/database_statements.rb:119:in `insert'
.../activerecord-5.0.0.beta1/lib/active_record/connection_adapters/abstract/query_cache.rb:14:in `insert'
.../activerecord-5.0.0.beta1/lib/active_record/relation.rb:65:in `insert'
.../activerecord-5.0.0.beta1/lib/active_record/persistence.rb:553:in `_create_record'
.../activerecord-5.0.0.beta1/lib/active_record/counter_cache.rb:128:in `_create_record'
.../activerecord-5.0.0.beta1/lib/active_record/locking/optimistic.rb:75:in `_create_record'
.../activerecord-5.0.0.beta1/lib/active_record/attribute_methods/dirty.rb:123:in `_create_record'
.../activerecord-5.0.0.beta1/lib/active_record/callbacks.rb:302:in `block in _create_record'
.../activesupport-5.0.0.beta1/lib/active_support/callbacks.rb:97:in `__run_callbacks__'
.../activesupport-5.0.0.beta1/lib/active_support/callbacks.rb:750:in `_run_create_callbacks'
.../activerecord-5.0.0.beta1/lib/active_record/callbacks.rb:302:in `_create_record'
.../activerecord-5.0.0.beta1/lib/active_record/timestamp.rb:64:in `_create_record'
.../activerecord-5.0.0.beta1/lib/active_record/persistence.rb:533:in `create_or_update'
.../activerecord-5.0.0.beta1/lib/active_record/callbacks.rb:298:in `block in create_or_update'
.../activesupport-5.0.0.beta1/lib/active_support/callbacks.rb:97:in `__run_callbacks__'
.../activesupport-5.0.0.beta1/lib/active_support/callbacks.rb:750:in `_run_save_callbacks'
.../activerecord-5.0.0.beta1/lib/active_record/callbacks.rb:298:in `create_or_update'
.../activerecord-5.0.0.beta1/lib/active_record/suppressor.rb:41:in `create_or_update'
.../activerecord-5.0.0.beta1/lib/active_record/persistence.rb:125:in `save'
.../activerecord-5.0.0.beta1/lib/active_record/validations.rb:44:in `save'
.../activerecord-5.0.0.beta1/lib/active_record/attribute_methods/dirty.rb:22:in `save'
.../activerecord-5.0.0.beta1/lib/active_record/transactions.rb:319:in `block (2 levels) in save'
.../activerecord-5.0.0.beta1/lib/active_record/transactions.rb:395:in `block in with_transaction_returning_status'
.../activerecord-5.0.0.beta1/lib/active_record/connection_adapters/abstract/database_statements.rb:222:in `block in transaction'
.../activerecord-5.0.0.beta1/lib/active_record/connection_adapters/abstract/transaction.rb:183:in `within_new_transaction'
.../activerecord-5.0.0.beta1/lib/active_record/connection_adapters/abstract/database_statements.rb:222:in `transaction'
.../activerecord-5.0.0.beta1/lib/active_record/transactions.rb:211:in `transaction'
.../activerecord-5.0.0.beta1/lib/active_record/transactions.rb:392:in `with_transaction_returning_status'
.../activerecord-5.0.0.beta1/lib/active_record/transactions.rb:319:in `block in save'
.../activerecord-5.0.0.beta1/lib/active_record/transactions.rb:334:in `rollback_active_record_state!'
.../activerecord-5.0.0.beta1/lib/active_record/transactions.rb:318:in `save'
.../activerecord-5.0.0.beta1/lib/active_record/persistence.rb:34:in `create'
/Users/cabeer/Projects/tmp/ar_regression/spec/controllers/broken_controller_spec.rb:5:in `block (2 levels) in <top (required)>'
```
### System configuration

**Rails version**: 5.0.0.beta1

**Ruby version**: 2.2.4

