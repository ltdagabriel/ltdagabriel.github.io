---
title: NameError: uninitialized constant ActiveRecord::ConnectionAdapters::DatabaseStatements::TransactionManager when calling reset_transaction
labels: activerecord
layout: issue
---

Saw this exception pop up.  I'm not sure how or why it happened, so I can't provide steps to reproduce it, but I'm happy to try anything to help.

```
2016-09-09T18:12:08.225Z 8 TID-ouaqkszjs WARN: NameError: uninitialized constant ActiveRecord::ConnectionAdapters::DatabaseStatements::TransactionManager
Did you mean?  ActiveRecord::ConnectionAdapters::TransactionManager
               ActiveRecord::ConnectionAdapters::Transaction
               ActiveRecord::ConnectionAdapters::TransactionState
2016-09-09T18:12:08.236Z 8 TID-ouaqkszjs WARN: /usr/lib/ruby/gems/2.3.0/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/abstract/database_statements.rb:247:in `reset_transaction'
/usr/lib/ruby/gems/2.3.0/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/abstract/database_statements.rb:6:in `initialize'
/usr/lib/ruby/gems/2.3.0/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/abstract/query_cache.rb:24:in `initialize'
/usr/lib/ruby/gems/2.3.0/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/abstract_adapter.rb:99:in `initialize'
/usr/lib/ruby/gems/2.3.0/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/postgresql_adapter.rb:209:in `initialize'
/usr/lib/ruby/gems/2.3.0/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/postgresql_adapter.rb:37:in `new'
/usr/lib/ruby/gems/2.3.0/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/postgresql_adapter.rb:37:in `postgresql_connection'
/usr/lib/ruby/gems/2.3.0/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/abstract/connection_pool.rb:721:in `new_connection'
/usr/lib/ruby/gems/2.3.0/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/abstract/connection_pool.rb:765:in `checkout_new_connection'
/usr/lib/ruby/gems/2.3.0/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/abstract/connection_pool.rb:744:in `try_to_checkout_new_connection'
/usr/lib/ruby/gems/2.3.0/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/abstract/connection_pool.rb:705:in `acquire_connection'
/usr/lib/ruby/gems/2.3.0/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/abstract/connection_pool.rb:501:in `checkout'
/usr/lib/ruby/gems/2.3.0/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/abstract/connection_pool.rb:364:in `connection'
/usr/lib/ruby/gems/2.3.0/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/abstract/connection_pool.rb:875:in `retrieve_connection'
/usr/lib/ruby/gems/2.3.0/gems/activerecord-5.0.0.1/lib/active_record/connection_handling.rb:128:in `retrieve_connection'
/usr/lib/ruby/gems/2.3.0/gems/activerecord-5.0.0.1/lib/active_record/connection_handling.rb:91:in `connection'
/usr/lib/ruby/gems/2.3.0/gems/activerecord-5.0.0.1/lib/active_record/query_cache.rb:47:in `block in install_executor_hooks'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:396:in `instance_exec'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:396:in `block in make_lambda'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:169:in `block (2 levels) in halting'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:547:in `block (2 levels) in default_terminator'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:546:in `catch'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:546:in `block in default_terminator'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:170:in `block in halting'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:454:in `block in call'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:454:in `each'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:454:in `call'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:101:in `__run_callbacks__'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:750:in `_run_complete_callbacks'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:90:in `run_callbacks'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/execution_wrapper.rb:107:in `complete!'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/execution_wrapper.rb:64:in `ensure in block in run!'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/execution_wrapper.rb:64:in `block in run!'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/execution_wrapper.rb:58:in `tap'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/execution_wrapper.rb:58:in `run!'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/execution_wrapper.rb:74:in `wrap'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/reloader.rb:67:in `wrap'
/usr/lib/ruby/gems/2.3.0/gems/activejob-5.0.0.1/lib/active_job/railtie.rb:25:in `block (3 levels) in <class:Railtie>'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:391:in `instance_exec'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:391:in `block in make_lambda'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:285:in `block in halting'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:447:in `block in around'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:455:in `call'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:101:in `__run_callbacks__'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:750:in `_run_execute_callbacks'
/usr/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.1/lib/active_support/callbacks.rb:90:in `run_callbacks'
/usr/lib/ruby/gems/2.3.0/gems/activejob-5.0.0.1/lib/active_job/execution.rb:20:in `execute'
/usr/lib/ruby/gems/2.3.0/gems/activejob-5.0.0.1/lib/active_job/queue_adapters/sidekiq_adapter.rb:40:in `perform'
/usr/lib/ruby/gems/2.3.0/gems/sidekiq-4.1.2/lib/sidekiq/processor.rb:152:in `execute_job'
/usr/lib/ruby/gems/2.3.0/gems/sidekiq-4.1.2/lib/sidekiq/processor.rb:134:in `block (2 levels) in process'
/usr/lib/ruby/gems/2.3.0/gems/sidekiq-4.1.2/lib/sidekiq/middleware/chain.rb:128:in `block in invoke'
/usr/lib/ruby/gems/2.3.0/gems/sidekiq-4.1.2/lib/sidekiq/middleware/server/active_record.rb:6:in `call'
/usr/lib/ruby/gems/2.3.0/gems/sidekiq-4.1.2/lib/sidekiq/middleware/chain.rb:130:in `block in invoke'
/usr/lib/ruby/gems/2.3.0/gems/sidekiq-4.1.2/lib/sidekiq/middleware/server/logging.rb:11:in `block in call'
/usr/lib/ruby/gems/2.3.0/gems/sidekiq-4.1.2/lib/sidekiq/logging.rb:32:in `with_context'
/usr/lib/ruby/gems/2.3.0/gems/sidekiq-4.1.2/lib/sidekiq/middleware/server/logging.rb:7:in `call'
/usr/lib/ruby/gems/2.3.0/gems/sidekiq-4.1.2/lib/sidekiq/middleware/chain.rb:130:in `block in invoke'
/usr/lib/ruby/gems/2.3.0/gems/sidekiq-4.1.2/lib/sidekiq/middleware/chain.rb:133:in `invoke'
/usr/lib/ruby/gems/2.3.0/gems/sidekiq-4.1.2/lib/sidekiq/processor.rb:129:in `block in process'
/usr/lib/ruby/gems/2.3.0/gems/sidekiq-4.1.2/lib/sidekiq/processor.rb:168:in `stats'
/usr/lib/ruby/gems/2.3.0/gems/sidekiq-4.1.2/lib/sidekiq/processor.rb:128:in `process'
/usr/lib/ruby/gems/2.3.0/gems/sidekiq-4.1.2/lib/sidekiq/processor.rb:80:in `process_one'
/usr/lib/ruby/gems/2.3.0/gems/sidekiq-4.1.2/lib/sidekiq/processor.rb:68:in `run'
/usr/lib/ruby/gems/2.3.0/gems/sidekiq-4.1.2/lib/sidekiq/util.rb:17:in `watchdog'
/usr/lib/ruby/gems/2.3.0/gems/sidekiq-4.1.2/lib/sidekiq/util.rb:25:in `block in safe_thread'
```

Something tells me that [this line](https://github.com/rails/rails/blob/b27acd0b69a093e1d9d91ddf52c9f6e1289e28e0/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb#L248)...

``` ruby
      def reset_transaction #:nodoc:
        @transaction_manager = TransactionManager.new(self)
      end
```

...should probably be updated to...

``` ruby
      def reset_transaction #:nodoc:
        @transaction_manager = ActiveRecord::ConnectionAdapters::TransactionManager.new(self)
      end
```

Also, it looks like the [two](https://github.com/rails/rails/blob/3fc0bbf008f0e935ab56559f119c9ea8250bfddd/activerecord/test/cases/transactions_test.rb#L659-L671) [tests](https://github.com/rails/rails/blob/3fc0bbf008f0e935ab56559f119c9ea8250bfddd/activerecord/test/cases/transactions_test.rb#L673-L685) actually call `TransactionManager` explicitly, so I believe that the `reset_transaction` method doesn't have a test to catch the above exception:

``` ruby
  def test_transactions_state_from_rollback
    connection = Topic.connection
    transaction = ActiveRecord::ConnectionAdapters::TransactionManager.new(connection).begin_transaction

    assert transaction.open?
    assert !transaction.state.rolledback?
    assert !transaction.state.committed?

    transaction.rollback

    assert transaction.state.rolledback?
    assert !transaction.state.committed?
  end

  def test_transactions_state_from_commit
    connection = Topic.connection
    transaction = ActiveRecord::ConnectionAdapters::TransactionManager.new(connection).begin_transaction

    assert transaction.open?
    assert !transaction.state.rolledback?
    assert !transaction.state.committed?

    transaction.commit

    assert !transaction.state.rolledback?
    assert transaction.state.committed?
  end
```
### System configuration

**Rails version**: 5.0.0.1
**Ruby version**: 2.3.1p112

