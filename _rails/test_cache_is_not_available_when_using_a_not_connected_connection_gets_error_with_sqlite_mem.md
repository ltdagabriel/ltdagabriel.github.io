---
title: test_cache_is_not_available_when_using_a_not_connected_connection gets error with sqlite3_mem
labels: activerecord, attached PR
layout: issue
---

### Steps to reproduce
```
$ cd activerecord
$ bundle
$ ARCONN=sqlite3_mem bundle exec ruby -w -Itest test/cases/query_cache_test.rb -n test_cache_is_not_available_when_using_a_not_connected_connection
```
### Expected behavior
It should finish without errors.

### Actual behavior
```ruby
$ ARCONN=sqlite3_mem bundle exec ruby -w -Itest test/cases/query_cache_test.rb -n test_cache_is_not_available_when_using_a_not_connected_connection
/home/yahonda/git/rails/activesupport/lib/active_support/core_ext/enumerable.rb:20: warning: method redefined; discarding old sum
Using sqlite3_mem
Run options: -n test_cache_is_not_available_when_using_a_not_connected_connection --seed 34410

# Running:

E

Finished in 0.083480s, 11.9788 runs/s, 11.9788 assertions/s.

  1) Error:
QueryCacheTest#test_cache_is_not_available_when_using_a_not_connected_connection:
ActiveRecord::StatementInvalid: SQLite3::SQLException: no such table: tasks: SELECT  "tasks".* FROM "tasks" WHERE "tasks"."id" = ? LIMIT ?
    /home/yahonda/.rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/gems/sqlite3-1.3.13/lib/sqlite3/database.rb:91:in `initialize'
    /home/yahonda/.rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/gems/sqlite3-1.3.13/lib/sqlite3/database.rb:91:in `new'
    /home/yahonda/.rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/gems/sqlite3-1.3.13/lib/sqlite3/database.rb:91:in `prepare'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:235:in `block (2 levels) in exec_query'
    /home/yahonda/git/rails/activesupport/lib/active_support/dependencies/interlock.rb:46:in `block in permit_concurrent_loads'
    /home/yahonda/git/rails/activesupport/lib/active_support/concurrency/share_lock.rb:185:in `yield_shares'
    /home/yahonda/git/rails/activesupport/lib/active_support/dependencies/interlock.rb:45:in `permit_concurrent_loads'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:220:in `block in exec_query'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:600:in `block in log'
    /home/yahonda/git/rails/activesupport/lib/active_support/notifications/instrumenter.rb:21:in `instrument'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:593:in `log'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:219:in `exec_query'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:365:in `select_prepared'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:40:in `select_all'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/query_cache.rb:95:in `select_all'
    /home/yahonda/git/rails/activerecord/lib/active_record/querying.rb:39:in `find_by_sql'
    /home/yahonda/git/rails/activerecord/lib/active_record/statement_cache.rb:107:in `execute'
    /home/yahonda/git/rails/activerecord/lib/active_record/core.rb:187:in `find'
    test/cases/query_cache_test.rb:297:in `block (2 levels) in test_cache_is_not_available_when_using_a_not_connected_connection'
    /home/yahonda/git/rails/activerecord/test/cases/test_case.rb:50:in `assert_queries'
    test/cases/query_cache_test.rb:297:in `block in test_cache_is_not_available_when_using_a_not_connected_connection'
    /home/yahonda/git/rails/activerecord/lib/active_record/query_cache.rb:11:in `cache'
    test/cases/query_cache_test.rb:295:in `test_cache_is_not_available_when_using_a_not_connected_connection'

1 runs, 1 assertions, 0 failures, 1 errors, 0 skips
$
```
### System configuration
**Rails version**: master branch

**Ruby version**: ruby 2.4.0p0 (2016-12-24 revision 57164) [x86_64-linux] and ruby 2.5.0dev (2017-01-28 trunk 57443) [x86_64-linux]

### Additional errors 
Depending on when `QueryCacheTest#test_cache_is_not_available_when_using_a_not_connected_connection` executed, if it executed first it causes additional 8 errors: By changing the file order to move `test/cases/query_cache_test.rb` to the end of this test, these addional 8 errors are gone.

```ruby
$ ARCONN=sqlite3_mem bundle exec ruby -w -I"lib:test" -I"/home/yahonda/.rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/gems/rake-12.0.0/lib" "/home/yahonda/.rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/gems/rake-12.0.0/lib/rake/rake_test_loader.rb" \
   "test/cases/query_cache_test.rb" \
   "test/cases/associations/has_many_associations_test.rb" \
   "test/cases/associations/has_and_belongs_to_many_associations_test.rb" \
   "test/cases/fixtures_test.rb"
```

```ruby
/home/yahonda/git/rails/activesupport/lib/active_support/core_ext/enumerable.rb:20: warning: method redefined; discarding old sum
Using sqlite3_mem
Run options: --seed 28474

# Running:

....E.............................................................................................................................................................................................................................................E.................................................................................E........................................................................E..................................EEEE............................................E

Finished in 13.742775s, 35.0002 runs/s, 135.0528 assertions/s.

  1) Error:
QueryCacheTest#test_cache_is_not_available_when_using_a_not_connected_connection:
ActiveRecord::StatementInvalid: SQLite3::SQLException: no such table: tasks: SELECT  "tasks".* FROM "tasks" WHERE "tasks"."id" = ? LIMIT ?
    /home/yahonda/.rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/gems/sqlite3-1.3.13/lib/sqlite3/database.rb:91:in `initialize'
    /home/yahonda/.rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/gems/sqlite3-1.3.13/lib/sqlite3/database.rb:91:in `new'
    /home/yahonda/.rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/gems/sqlite3-1.3.13/lib/sqlite3/database.rb:91:in `prepare'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:223:in `block (2 levels) in exec_query'
    /home/yahonda/git/rails/activesupport/lib/active_support/dependencies/interlock.rb:46:in `block in permit_concurrent_loads'
    /home/yahonda/git/rails/activesupport/lib/active_support/concurrency/share_lock.rb:185:in `yield_shares'
    /home/yahonda/git/rails/activesupport/lib/active_support/dependencies/interlock.rb:45:in `permit_concurrent_loads'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:220:in `block in exec_query'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:600:in `block in log'
    /home/yahonda/git/rails/activesupport/lib/active_support/notifications/instrumenter.rb:21:in `instrument'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:593:in `log'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:219:in `exec_query'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:361:in `select'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:42:in `select_all'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/query_cache.rb:95:in `select_all'
    /home/yahonda/git/rails/activerecord/lib/active_record/querying.rb:39:in `find_by_sql'
    /home/yahonda/git/rails/activerecord/lib/active_record/statement_cache.rb:107:in `execute'
    /home/yahonda/git/rails/activerecord/lib/active_record/core.rb:187:in `find'
    /home/yahonda/git/rails/activerecord/test/cases/query_cache_test.rb:297:in `block (2 levels) in test_cache_is_not_available_when_using_a_not_connected_connection'
    /home/yahonda/git/rails/activerecord/test/cases/test_case.rb:50:in `assert_queries'
    /home/yahonda/git/rails/activerecord/test/cases/query_cache_test.rb:297:in `block in test_cache_is_not_available_when_using_a_not_connected_connection'
    /home/yahonda/git/rails/activerecord/lib/active_record/query_cache.rb:11:in `cache'
    /home/yahonda/git/rails/activerecord/test/cases/query_cache_test.rb:295:in `test_cache_is_not_available_when_using_a_not_connected_connection'


  2) Error:
HasManyAssociationsTest#test_has_many_build_with_options:
ActiveRecord::StatementInvalid: Could not find table 'colleges'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:463:in `table_structure'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:167:in `columns'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/schema_cache.rb:67:in `columns'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/schema_cache.rb:73:in `columns_hash'
    /home/yahonda/git/rails/activerecord/lib/active_record/model_schema.rb:450:in `load_schema!'
    /home/yahonda/git/rails/activerecord/lib/active_record/attributes.rb:233:in `load_schema!'
    /home/yahonda/git/rails/activerecord/lib/active_record/attribute_decorators.rb:50:in `load_schema!'
    /home/yahonda/git/rails/activerecord/lib/active_record/model_schema.rb:445:in `load_schema'
    /home/yahonda/git/rails/activerecord/lib/active_record/model_schema.rb:349:in `attribute_types'
    /home/yahonda/git/rails/activerecord/lib/active_record/attribute_methods.rb:179:in `has_attribute?'
    /home/yahonda/git/rails/activerecord/lib/active_record/inheritance.rb:55:in `new'
    /home/yahonda/git/rails/activerecord/lib/active_record/persistence.rb:33:in `create'
    /home/yahonda/git/rails/activerecord/test/cases/associations/has_many_associations_test.rb:162:in `test_has_many_build_with_options'


  3) Error:
HasAndBelongsToManyAssociationsTest#test_alternate_database:
ActiveRecord::StatementInvalid: Could not find table 'professors'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:463:in `table_structure'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:167:in `columns'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/schema_cache.rb:67:in `columns'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/schema_cache.rb:73:in `columns_hash'
    /home/yahonda/git/rails/activerecord/lib/active_record/model_schema.rb:450:in `load_schema!'
    /home/yahonda/git/rails/activerecord/lib/active_record/attributes.rb:233:in `load_schema!'
    /home/yahonda/git/rails/activerecord/lib/active_record/attribute_decorators.rb:50:in `load_schema!'
    /home/yahonda/git/rails/activerecord/lib/active_record/model_schema.rb:445:in `load_schema'
    /home/yahonda/git/rails/activerecord/lib/active_record/model_schema.rb:349:in `attribute_types'
    /home/yahonda/git/rails/activerecord/lib/active_record/attribute_methods.rb:179:in `has_attribute?'
    /home/yahonda/git/rails/activerecord/lib/active_record/inheritance.rb:55:in `new'
    /home/yahonda/git/rails/activerecord/lib/active_record/persistence.rb:33:in `create'
    /home/yahonda/git/rails/activerecord/test/cases/associations/has_and_belongs_to_many_associations_test.rb:961:in `test_alternate_database'


  4) Error:
FixturesTest#test_create_symbol_fixtures:
ActiveRecord::StatementInvalid: Could not find table 'courses'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:463:in `table_structure'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:167:in `columns'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:770:in `column_names'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:762:in `timestamp_column_names'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:640:in `block in table_rows'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:634:in `each'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:634:in `map'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:634:in `table_rows'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:542:in `block (3 levels) in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:540:in `each'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:540:in `block (2 levels) in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:225:in `block in transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/transaction.rb:186:in `within_new_transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:225:in `transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:538:in `block in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:201:in `disable_referential_integrity'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:523:in `create_fixtures'
    /home/yahonda/git/rails/activerecord/test/cases/fixtures_test.rb:86:in `test_create_symbol_fixtures'


  5) Error:
CustomConnectionFixturesTest#test_it_twice_in_whatever_order_to_check_for_fixture_leakage:
ActiveRecord::StatementInvalid: Could not find table 'courses'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:463:in `table_structure'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:167:in `columns'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:770:in `column_names'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:762:in `timestamp_column_names'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:640:in `block in table_rows'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:634:in `each'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:634:in `map'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:634:in `table_rows'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:542:in `block (3 levels) in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:540:in `each'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:540:in `block (2 levels) in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:225:in `block in transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/transaction.rb:186:in `within_new_transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:225:in `transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:538:in `block in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:201:in `disable_referential_integrity'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:523:in `create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:1025:in `load_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:997:in `setup_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:851:in `before_setup'


  6) Error:
CustomConnectionFixturesTest#test_leaky_destroy:
ActiveRecord::StatementInvalid: Could not find table 'courses'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:463:in `table_structure'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:167:in `columns'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:770:in `column_names'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:762:in `timestamp_column_names'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:640:in `block in table_rows'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:634:in `each'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:634:in `map'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:634:in `table_rows'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:542:in `block (3 levels) in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:540:in `each'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:540:in `block (2 levels) in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:225:in `block in transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/transaction.rb:186:in `within_new_transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:225:in `transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:538:in `block in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:201:in `disable_referential_integrity'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:523:in `create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:1025:in `load_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:997:in `setup_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:851:in `before_setup'


  7) Error:
TransactionalFixturesOnCustomConnectionTest#test_it_twice_in_whatever_order_to_check_for_fixture_leakage:
ActiveRecord::StatementInvalid: Could not find table 'courses'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:463:in `table_structure'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:167:in `columns'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:770:in `column_names'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:762:in `timestamp_column_names'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:640:in `block in table_rows'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:634:in `each'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:634:in `map'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:634:in `table_rows'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:542:in `block (3 levels) in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:540:in `each'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:540:in `block (2 levels) in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:225:in `block in transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/transaction.rb:186:in `within_new_transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:225:in `transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:538:in `block in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:201:in `disable_referential_integrity'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:523:in `create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:1025:in `load_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:965:in `setup_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:851:in `before_setup'


  8) Error:
TransactionalFixturesOnCustomConnectionTest#test_leaky_destroy:
ActiveRecord::StatementInvalid: Could not find table 'courses'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:463:in `table_structure'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:167:in `columns'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:770:in `column_names'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:762:in `timestamp_column_names'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:640:in `block in table_rows'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:634:in `each'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:634:in `map'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:634:in `table_rows'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:542:in `block (3 levels) in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:540:in `each'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:540:in `block (2 levels) in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:225:in `block in transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/transaction.rb:186:in `within_new_transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:225:in `transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:538:in `block in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:201:in `disable_referential_integrity'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:523:in `create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:1025:in `load_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:965:in `setup_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:851:in `before_setup'


  9) Error:
SameNameDifferentDatabaseFixturesTest#test_fixtures_are_properly_loaded:
ActiveRecord::StatementInvalid: Could not find table 'dogs'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:463:in `table_structure'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:167:in `columns'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:770:in `column_names'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:762:in `timestamp_column_names'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:640:in `block in table_rows'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:634:in `each'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:634:in `map'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:634:in `table_rows'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:542:in `block (3 levels) in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:540:in `each'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:540:in `block (2 levels) in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:225:in `block in transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/transaction.rb:186:in `within_new_transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:225:in `transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:538:in `block in create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/sqlite3_adapter.rb:201:in `disable_referential_integrity'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:523:in `create_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:1025:in `load_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:965:in `setup_fixtures'
    /home/yahonda/git/rails/activerecord/lib/active_record/fixtures.rb:851:in `before_setup'

481 runs, 1856 assertions, 0 failures, 9 errors, 0 skips
$
```
cc @koic who originally blogged this failure.

