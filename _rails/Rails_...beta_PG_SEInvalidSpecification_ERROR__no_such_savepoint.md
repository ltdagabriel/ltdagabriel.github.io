---
title: Rails 5.1.0.beta1: PG::SEInvalidSpecification: ERROR:  no such savepoint
labels: activerecord
layout: issue
---

This now happens during a full test run against a Postgres DB. Could it be related to PR #28083 ? 

### Steps to reproduce
Run full suite of tests after updating Rails 5.0.1 to 5.1.0.beta1

### Expected behavior
1) Rspec tests should continue to succeed after upgrade
2) We should get the same result running the tests locally and on the build server (codeship)

### Actual behavior
On git push we get 3 test failures out of 1400 on the build server , but on running a failed test locally - it succeeds. And when we run the full suite of tests locally ( with later ruby version 2.3 ) it sometimes succeeds, sometimes fails, sometimes fails to complete and outputs:

```
message type 0x54 arrived from server while idle
message type 0x44 arrived from server while idle
message type 0x43 arrived from server while idle
message type 0x5a arrived from server while idle
.rvm/rubies/ruby-2.3.0/lib/ruby/2.3.0/logger.rb:654: [BUG] Segmentation fault at 0x000000000001a0
ruby 2.3.0p0 (2015-12-25 revision 53290) [x86_64-linux]
```

Here is the output of a test failure from the build server:

```
Engagement::PublicationsHelper publish_load_complete_notify publishes to subscribers 
Failure/Error: @user = create(:user)
ActiveRecord::StatementInvalid:
PG::SEInvalidSpecification: ERROR:  no such savepoint
: ROLLBACK TO SAVEPOINT active_record_2
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/connection_adapters/postgresql/database_statements.rb:97:in async_exec
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/connection_adapters/postgresql/database_statements.rb:97:in block (2 levels) in execute
/home/rof/cache/bundler/ruby/2.2.0/gems/activesupport-5.1.0.beta1/lib/active_support/dependencies/interlock.rb:46:in block in permit_concurrent_loads
/home/rof/cache/bundler/ruby/2.2.0/gems/activesupport-5.1.0.beta1/lib/active_support/concurrency/share_lock.rb:185:in yield_shares
/home/rof/cache/bundler/ruby/2.2.0/gems/activesupport-5.1.0.beta1/lib/active_support/dependencies/interlock.rb:45:in permit_concurrent_loads
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/connection_adapters/postgresql/database_statements.rb:96:in block in execute
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/connection_adapters/abstract_adapter.rb:611:in block (2 levels) in log
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/connection_adapters/abstract_adapter.rb:610:in block in log
/home/rof/cache/bundler/ruby/2.2.0/gems/activesupport-5.1.0.beta1/lib/active_support/notifications/instrumenter.rb:21:in instrument
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/connection_adapters/abstract_adapter.rb:602:in log
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/connection_adapters/postgresql/database_statements.rb:95:in execute
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/connection_adapters/abstract/savepoints.rb:13:in exec_rollback_to_savepoint
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/connection_adapters/abstract/database_statements.rb:284:in rollback_to_savepoint
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/connection_adapters/abstract/query_cache.rb:17:in rollback_to_savepoint
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/connection_adapters/abstract/transaction.rb:112:in rollback
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/connection_adapters/abstract/transaction.rb:180:in rollback_transaction
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/connection_adapters/abstract/transaction.rb:201:in rescue in within_new_transaction
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/connection_adapters/abstract/transaction.rb:198:in within_new_transaction
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/connection_adapters/abstract/database_statements.rb:225:in transaction
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/transactions.rb:210:in transaction
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/transactions.rb:381:in with_transaction_returning_status
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/transactions.rb:313:in save!
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/suppressor.rb:46:in save!
/home/rof/cache/bundler/ruby/2.2.0/gems/factory_girl-4.8.0/lib/factory_girl/configuration.rb:18:in block in initialize
/home/rof/cache/bundler/ruby/2.2.0/gems/factory_girl-4.8.0/lib/factory_girl/evaluation.rb:15:in []
/home/rof/cache/bundler/ruby/2.2.0/gems/factory_girl-4.8.0/lib/factory_girl/evaluation.rb:15:in create
/home/rof/cache/bundler/ruby/2.2.0/gems/factory_girl-4.8.0/lib/factory_girl/strategy/create.rb:12:in block in result
/home/rof/cache/bundler/ruby/2.2.0/gems/factory_girl-4.8.0/lib/factory_girl/strategy/create.rb:9:in tap
/home/rof/cache/bundler/ruby/2.2.0/gems/factory_girl-4.8.0/lib/factory_girl/strategy/create.rb:9:in result
/home/rof/cache/bundler/ruby/2.2.0/gems/factory_girl-4.8.0/lib/factory_girl/factory.rb:42:in run
/home/rof/cache/bundler/ruby/2.2.0/gems/factory_girl-4.8.0/lib/factory_girl/factory_runner.rb:29:in block in run
/home/rof/cache/bundler/ruby/2.2.0/gems/activesupport-5.1.0.beta1/lib/active_support/notifications.rb:166:in instrument
/home/rof/cache/bundler/ruby/2.2.0/gems/factory_girl-4.8.0/lib/factory_girl/factory_runner.rb:28:in run
/home/rof/cache/bundler/ruby/2.2.0/gems/factory_girl-4.8.0/lib/factory_girl/strategy_syntax_method_registrar.rb:20:in block in define_singular_strategy_method
./spec/helpers/engagement/publications_helper_spec.rb:39:in block (3 levels) in <top (required)>


Caused by:
PG::SEInvalidSpecification:
ERROR:  no such savepoint
/home/rof/cache/bundler/ruby/2.2.0/gems/activerecord-5.1.0.beta1/lib/active_record/connection_adapters/postgresql/database_statements.rb:97:in async_exec
```

### System configuration
**Rails version**: 5.1.0.beta1
**Ruby version**: ruby/2.2.0

