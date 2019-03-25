---
title: ERROR:  bind message supplies 0 parameters, but prepared statement "" requires 1
labels: activerecord, attached PR
layout: issue
---

### Steps to reproduce

``` ruby
require 'bundler/inline'

gemfile(true) do
  source 'https://rubygems.org'
  gem 'activerecord', github: 'rails/rails'
  gem 'pg'
end

require 'active_record'
require 'minitest/autorun'
require 'logger'

ActiveRecord::Base.establish_connection(adapter: 'postgresql', port: 5495)
#ActiveRecord::Base.logger = Logger.new(STDOUT)
ActiveRecord::Schema.define do
  create_table :people, temporary: true do |t|
    t.string :name
    t.boolean :deleted, null: false, default: false
    t.timestamps null: false
  end
  create_table :emails, temporary: true do |t|
    t.belongs_to :person
    t.string :addr
    t.boolean :deleted, null: false, default: false
  end
end
if defined? ActiveSupport.halt_callback_chains_on_return_false=
  ActiveSupport.halt_callback_chains_on_return_false = false
end

class Person < ActiveRecord::Base
  has_many :emails

  after_save do
    # synchronize associated emails' deleted flag - FAIL HERE
    emails.update_all(deleted: deleted?)
    true
  end
end
class Email < ActiveRecord::Base
  belongs_to :person
end

class BugTest < Minitest::Test
  # PASS - assign primary key BEFORE association
  def test_pass1
    person = Person.new
    person.id = 10
    person.name = 'FooBar'
    person.emails = [Email.new(addr: 'test1@example.com')]
    person.emails
    person.save!
    assert Person.find(10)
  end

  # PASS - don't access association
  def test_pass2
    person = Person.new
    person.name = 'FooBar'
    person.emails = [Email.new(addr: 'test2@example.com')]
    person.id = 11
    person.save!
    assert Person.find(11)
  end

  # FAIL - assign primary key AFTER association, and then access association
  def test_fail
    person = Person.new
    person.name = 'FooBar'
    person.emails = [Email.new(addr: 'test3@example.com')]
    person.id = 12
    person.emails
    person.save!
    assert Person.find(12)
  end
end
```
### Expected behavior (Rails 4.2.6)

All tests passed.
### Actual behavior (Rails 5.0.0 and master)

Test `test_fail` failed with following error. Bind values for `UPDATE` SQL should be `[12]`, but empty.

```
  1) Error:
BugTest#test_fail:
ActiveRecord::StatementInvalid: PG::ProtocolViolation: ERROR:  bind message supplies 0 parameters, but prepared statement "" requires 1
: UPDATE "emails" SET "deleted" = 'f' WHERE "emails"."person_id" = $1
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/connection_adapters/postgresql_adapter.rb:601:in `async_exec'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/connection_adapters/postgresql_adapter.rb:601:in `block in exec_no_cache'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:589:in `block in log'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activesupport/lib/active_support/notifications/instrumenter.rb:21:in `instrument'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:583:in `log'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/connection_adapters/postgresql_adapter.rb:601:in `exec_no_cache'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/connection_adapters/postgresql_adapter.rb:588:in `execute_and_clear'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/connection_adapters/postgresql/database_statements.rb:116:in `exec_delete'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:133:in `update'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/connection_adapters/abstract/query_cache.rb:14:in `update'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/relation.rb:387:in `update_all'
    test_update_all.rb:45:in `block in <class:Person>'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activesupport/lib/active_support/callbacks.rb:396:in `instance_exec'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activesupport/lib/active_support/callbacks.rb:396:in `block in make_lambda'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activesupport/lib/active_support/callbacks.rb:207:in `block in halting_and_conditional'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activesupport/lib/active_support/callbacks.rb:456:in `block in call'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activesupport/lib/active_support/callbacks.rb:456:in `each'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activesupport/lib/active_support/callbacks.rb:456:in `call'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activesupport/lib/active_support/callbacks.rb:101:in `__run_callbacks__'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activesupport/lib/active_support/callbacks.rb:755:in `_run_save_callbacks'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/callbacks.rb:298:in `create_or_update'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/persistence.rb:152:in `save!'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/validations.rb:50:in `save!'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/attribute_methods/dirty.rb:30:in `save!'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/transactions.rb:324:in `block in save!'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/transactions.rb:395:in `block in with_transaction_returning_status'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:232:in `block in transaction'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/connection_adapters/abstract/transaction.rb:189:in `within_new_transaction'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:232:in `transaction'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/transactions.rb:211:in `transaction'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/transactions.rb:392:in `with_transaction_returning_status'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/transactions.rb:324:in `save!'
    /home/tietew/.gem/ruby/2.3.0/bundler/gems/rails-19ff64d8f46d/activerecord/lib/active_record/suppressor.rb:46:in `save!'
    test_update_all.rb:82:in `test_fail'
```
### System configuration

**Rails version**: 5.0.0 and master

**Ruby version**: 2.3.1

**PostgreSQL version**: 9.5.1

