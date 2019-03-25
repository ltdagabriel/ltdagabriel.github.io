---
title: UniquenessValidator should throw error if run on a table without primary key
labels: activerecord
layout: issue
---

You cannot have a uniqueness validator on a table that does not have a primary key, which makes sense, because otherwise we would not be able to figure out (while updating) which record is the current record and thus needs to be excluded from the entries that you check against. See #18674.

However, instead of throwing a nice human-readable error, you get this (Rails 4.2.1)

```
NoMethodError - undefined method `to_sym' for nil:NilClass:
  activerecord (4.2.1) lib/active_record/validations/uniqueness.rb:19:in `validate_each'
  activemodel (4.2.1) lib/active_model/validator.rb:151:in `block in validate'
  activemodel (4.2.1) lib/active_model/validator.rb:148:in `validate'
  activesupport (4.2.1) lib/active_support/callbacks.rb:455:in `block in make_lambda'
  activesupport (4.2.1) lib/active_support/callbacks.rb:192:in `block in simple'
  activesupport (4.2.1) lib/active_support/callbacks.rb:504:in `block in call'
  activesupport (4.2.1) lib/active_support/callbacks.rb:504:in `call'
  activesupport (4.2.1) lib/active_support/callbacks.rb:92:in `_run_callbacks'
  activesupport (4.2.1) lib/active_support/callbacks.rb:776:in `_run_validate_callbacks'
  activemodel (4.2.1) lib/active_model/validations.rb:395:in `run_validations!'
  activemodel (4.2.1) lib/active_model/validations/callbacks.rb:113:in `block in run_validations!'
  activesupport (4.2.1) lib/active_support/callbacks.rb:88:in `_run_callbacks'
  activesupport (4.2.1) lib/active_support/callbacks.rb:776:in `_run_validation_callbacks'
  activemodel (4.2.1) lib/active_model/validations/callbacks.rb:113:in `run_validations!'
  activemodel (4.2.1) lib/active_model/validations.rb:334:in `valid?'
  activerecord (4.2.1) lib/active_record/validations.rb:58:in `valid?'
  activerecord (4.2.1) lib/active_record/validations.rb:83:in `perform_validations'
  activerecord (4.2.1) lib/active_record/validations.rb:43:in `save!'
  activerecord (4.2.1) lib/active_record/attribute_methods/dirty.rb:29:in `save!'
  activerecord (4.2.1) lib/active_record/transactions.rb:291:in `block in save!'
  activerecord (4.2.1) lib/active_record/transactions.rb:347:in `block in with_transaction_returning_status'
  activerecord (4.2.1) lib/active_record/connection_adapters/abstract/database_statements.rb:211:in `transaction'
  activerecord (4.2.1) lib/active_record/transactions.rb:220:in `transaction'
  activerecord (4.2.1) lib/active_record/transactions.rb:344:in `with_transaction_returning_status'
  activerecord (4.2.1) lib/active_record/transactions.rb:291:in `save!'
  activerecord (4.2.1) lib/active_record/associations/has_many_through_association.rb:112:in `save_through_record'
  activerecord (4.2.1) lib/active_record/associations/has_many_through_association.rb:66:in `insert_record'
  activerecord (4.2.1) lib/active_record/autosave_association.rb:373:in `block in save_collection_association'
  activerecord (4.2.1) lib/active_record/autosave_association.rb:364:in `save_collection_association'
  activerecord (4.2.1) lib/active_record/autosave_association.rb:184:in `block in add_autosave_association_callbacks'
  activerecord (4.2.1) lib/active_record/autosave_association.rb:157:in `block in define_non_cyclic_method'
  activesupport (4.2.1) lib/active_support/callbacks.rb:432:in `block in make_lambda'
  activesupport (4.2.1) lib/active_support/callbacks.rb:228:in `block in halting_and_conditional'
  activesupport (4.2.1) lib/active_support/callbacks.rb:506:in `block in call'
  activesupport (4.2.1) lib/active_support/callbacks.rb:506:in `call'
  activesupport (4.2.1) lib/active_support/callbacks.rb:92:in `_run_callbacks'
  activesupport (4.2.1) lib/active_support/callbacks.rb:776:in `_run_create_callbacks'
  activerecord (4.2.1) lib/active_record/callbacks.rb:306:in `_create_record'
  activerecord (4.2.1) lib/active_record/timestamp.rb:57:in `_create_record'
  activerecord (4.2.1) lib/active_record/persistence.rb:502:in `create_or_update'
  activerecord (4.2.1) lib/active_record/callbacks.rb:302:in `block in create_or_update'
  activesupport (4.2.1) lib/active_support/callbacks.rb:117:in `call'
  activesupport (4.2.1) lib/active_support/callbacks.rb:555:in `block (2 levels) in compile'
  activesupport (4.2.1) lib/active_support/callbacks.rb:505:in `call'
  activesupport (4.2.1) lib/active_support/callbacks.rb:92:in `_run_callbacks'
  activesupport (4.2.1) lib/active_support/callbacks.rb:776:in `_run_save_callbacks'
  activerecord (4.2.1) lib/active_record/callbacks.rb:302:in `create_or_update'
  activerecord (4.2.1) lib/active_record/persistence.rb:120:in `save'
  activerecord (4.2.1) lib/active_record/validations.rb:37:in `save'
  activerecord (4.2.1) lib/active_record/attribute_methods/dirty.rb:21:in `save'
  activerecord (4.2.1) lib/active_record/transactions.rb:286:in `block (2 levels) in save'
  activerecord (4.2.1) lib/active_record/transactions.rb:347:in `block in with_transaction_returning_status'
  activerecord (4.2.1) lib/active_record/connection_adapters/abstract/database_statements.rb:213:in `block in transaction'
  activerecord (4.2.1) lib/active_record/connection_adapters/abstract/transaction.rb:188:in `within_new_transaction'
  activerecord (4.2.1) lib/active_record/connection_adapters/abstract/database_statements.rb:213:in `transaction'
  activerecord (4.2.1) lib/active_record/transactions.rb:220:in `transaction'
  activerecord (4.2.1) lib/active_record/transactions.rb:344:in `with_transaction_returning_status'
  activerecord (4.2.1) lib/active_record/transactions.rb:286:in `block in save'
  activerecord (4.2.1) lib/active_record/transactions.rb:301:in `rollback_active_record_state!'
  activerecord (4.2.1) lib/active_record/transactions.rb:285:in `save'
```

