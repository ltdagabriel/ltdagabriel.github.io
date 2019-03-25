---
title: Postgresql adapter rake tasks don't work with url key of database.yml
labels: activerecord
layout: issue
---

Given the following database.yml:

```
default: &default
  adapter: postgresql
  encoding: unicode
  # For details on connection pooling, see rails configuration guide
  # http://guides.rubyonrails.org/configuring.html#database-pooling
  pool: 5

production:
  <<: *default
  url: <%= ENV['DATABASE_URL'] %>
```

When I run heroku rake db:schema:load I get:

```
PG::ConnectionBad: FATAL:  permission denied for database "postgres"
DETAIL:  User does not have CONNECT privilege.
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/connection_adapters/postgresql_adapter.rb:651:in `initialize'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/connection_adapters/postgresql_adapter.rb:651:in `new'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/connection_adapters/postgresql_adapter.rb:651:in `connect'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/connection_adapters/postgresql_adapter.rb:242:in `initialize'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/connection_adapters/postgresql_adapter.rb:44:in `new'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/connection_adapters/postgresql_adapter.rb:44:in `postgresql_connection'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/connection_adapters/abstract/connection_pool.rb:436:in `new_connection'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/connection_adapters/abstract/connection_pool.rb:446:in `checkout_new_connection'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/connection_adapters/abstract/connection_pool.rb:422:in `acquire_connection'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/connection_adapters/abstract/connection_pool.rb:349:in `block in checkout'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/connection_adapters/abstract/connection_pool.rb:348:in `checkout'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/connection_adapters/abstract/connection_pool.rb:263:in `block in connection'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/connection_adapters/abstract/connection_pool.rb:262:in `connection'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/connection_adapters/abstract/connection_pool.rb:565:in `retrieve_connection'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/connection_handling.rb:113:in `retrieve_connection'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/connection_handling.rb:87:in `connection'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/tasks/postgresql_database_tasks.rb:8:in `connection'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/tasks/postgresql_database_tasks.rb:30:in `drop'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/tasks/postgresql_database_tasks.rb:43:in `purge'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/tasks/database_tasks.rb:163:in `purge'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/tasks/database_tasks.rb:217:in `load_schema_for'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/tasks/database_tasks.rb:237:in `block in load_schema_current'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/tasks/database_tasks.rb:277:in `block in each_current_configuration'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/tasks/database_tasks.rb:276:in `each'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/tasks/database_tasks.rb:276:in `each_current_configuration'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/tasks/database_tasks.rb:236:in `load_schema_current'
/app/vendor/bundle/ruby/2.1.0/gems/activerecord-4.2.0.rc2/lib/active_record/railties/databases.rake:244:in `block (3 levels) in <top (required)>'
Tasks: TOP => db:schema:load
(See full trace by running task with --trace)
```

It seems the adapter is not picking up the name of the database properly for the rake tasks.

