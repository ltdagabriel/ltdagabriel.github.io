---
title: broken migrations on 4.0 + sqlite ?
labels: activerecord, needs feedback
layout: issue
---

I am trying out current master branch to very originally create a blog 
When running a add_column migration I am getting an exception.

This is the migration:

``` Ruby
class AddHtmlToPosts < ActiveRecord::Migration
   def change
      add_column :posts, :html, :text
   end
end
```

And this is the expection

```
SQLite3::ConstraintException: constraint failed: INSERT INTO "schema_migrations" ("version") VALUES (?)
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/gems/sqlite3-1.3.6/lib/sqlite3/statement.rb:108:in `step'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/gems/sqlite3-1.3.6/lib/sqlite3/statement.rb:108:in `block in each'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/gems/sqlite3-1.3.6/lib/sqlite3/statement.rb:107:in `loop'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/gems/sqlite3-1.3.6/lib/sqlite3/statement.rb:107:in `each'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:307:in `to_a'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:307:in `block in exec_query'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:305:in `block in log'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activesupport/lib/active_support/notifications/instrumenter.rb:20:in `instrument'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:300:in `log'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:286:in `exec_query'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:69:in `exec_insert'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:96:in `insert'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/connection_adapters/abstract/query_cache.rb:14:in `insert'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/relation.rb:76:in `insert'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/persistence.rb:432:in `create'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/attribute_methods/dirty.rb:79:in `create'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/callbacks.rb:303:in `block in create'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activesupport/lib/active_support/callbacks.rb:373:in `_run__2351834022137602918__create__callbacks'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activesupport/lib/active_support/callbacks.rb:78:in `run_callbacks'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/callbacks.rb:303:in `create'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/timestamp.rb:57:in `create'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/persistence.rb:409:in `create_or_update'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/callbacks.rb:299:in `block in create_or_update'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activesupport/lib/active_support/callbacks.rb:373:in `_run__2351834022137602918__save__callbacks'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activesupport/lib/active_support/callbacks.rb:78:in `run_callbacks'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/callbacks.rb:299:in `create_or_update'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/persistence.rb:120:in `save!'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/validations.rb:57:in `save!'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/attribute_methods/dirty.rb:42:in `save!'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/transactions.rb:274:in `block in save!'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/transactions.rb:322:in `block in with_transaction_returning_status'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:199:in `transaction'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/transactions.rb:209:in `transaction'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/transactions.rb:319:in `with_transaction_returning_status'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/transactions.rb:274:in `save!'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/validations.rb:41:in `create!'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/migration.rb:925:in `record_version_state_after_migrating'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/migration.rb:861:in `block (2 levels) in migrate'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/migration.rb:940:in `block in ddl_transaction'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:201:in `block in transaction'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:209:in `within_new_transaction'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:201:in `transaction'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/transactions.rb:209:in `transaction'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/migration.rb:940:in `ddl_transaction'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/migration.rb:859:in `block in migrate'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/migration.rb:855:in `each'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/migration.rb:855:in `migrate'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/migration.rb:711:in `up'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/migration.rb:689:in `migrate'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bundler/gems/rails-2e92a23bdf9f/activerecord/lib/active_record/railties/databases.rake:48:in `block (2 levels) in <top (required)>'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bin/ruby_noexec_wrapper:14:in `eval'
/Users/jcarres/.rvm/gems/ruby-1.9.3-p125@tavern/bin/ruby_noexec_wrapper:14:in `<main>'
```

As it complains about the size of the version, maybe this is useful for reference. I runned 2 migrations successfully with a 3-weeks old Rails master, I have this in my db/schema:

``` Ruby
  migrations do
    migration 20121208013924, "44a13c3a0ee956e2ad9914777a724316", "create_users"
    migration 20121208022632, "4f7a9a804d7186678e5daca00b6aaa43", "create_posts"
  end
```

As you can see, I am not creating rocket science software here :rocket: 

