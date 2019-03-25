---
title: ORA-00907: missing right parenthesis since #5153 merged
labels: activerecord
layout: issue
---

Since pull request #5153 (commit 07e5301e697d6a02ed3c079aba07c261d53c1846) has been merged
to the rails-master branch, these 4 tests got errors with the Oracle enhanced adapter.

This error message is not straightforward although, it means Oracle does not allow ORDER BY clause within subquery.

``` sql
ORA-00907: missing right parenthesis:
```

``` sql
SELECT * FROM (SELECT  "PEOPLE".* FROM "PEOPLE"  WHERE "PEOPLE"."ID" = :a1 ORDER BY "PEOPLE"."ID" ASC FOR UPDATE) WHERE ROWNUM <= 1
```

``` ruby
$ ARCONN=oracle ruby -Itest test/cases/locking_test.rb
Using oracle
Run options: --seed 58662

# Running tests:

... snip ...

Finished tests in 21.402423s, 1.4484 tests/s, 4.8593 assertions/s.

  1) Error:
test_eager_find_with_lock(PessimisticLockingTest):
ActiveRecord::StatementInvalid: OCIError: ORA-00907: missing right parenthesis: SELECT * FROM (SELECT  "PEOPLE".* FROM "PEOPLE"  WHERE "PEOPLE"."ID" = :a1 ORDER BY "PEOPLE"."ID" ASC FOR UPDATE) WHERE ROWNUM <= 1
    stmt.c:253:in oci8lib_191.so
    /home/yahonda/.rvm/gems/ruby-1.9.3-p194@railsmaster/gems/ruby-oci8-2.1.2/lib/oci8/oci8.rb:474:in `exec'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_oci_connection.rb:143:in `exec'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_adapter.rb:639:in `block in exec_query'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:288:in `block in log'
    /home/yahonda/git/rails/activesupport/lib/active_support/notifications/instrumenter.rb:18:in `instrument'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:283:in `log'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_adapter.rb:1322:in `log'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_adapter.rb:619:in `exec_query'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_adapter.rb:1276:in `select'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:18:in `select_all'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/query_cache.rb:63:in `select_all'
    /home/yahonda/git/rails/activerecord/lib/active_record/querying.rb:40:in `block in find_by_sql'
    /home/yahonda/git/rails/activerecord/lib/active_record/explain.rb:37:in `logging_query_plan'
    /home/yahonda/git/rails/activerecord/lib/active_record/querying.rb:39:in `find_by_sql'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation.rb:174:in `exec_queries'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation.rb:164:in `block in to_a'
    /home/yahonda/git/rails/activerecord/lib/active_record/explain.rb:37:in `logging_query_plan'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation.rb:163:in `to_a'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:365:in `find_first'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:99:in `first'
    /home/yahonda/.rvm/gems/ruby-1.9.3-p194@railsmaster/bundler/gems/active_record_deprecated_finders-59a4f84c48be/lib/active_record_deprecated_finders/relation.rb:126:in `first'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:313:in `find_one'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:299:in `find_with_ids'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:40:in `find'
    /home/yahonda/.rvm/gems/ruby-1.9.3-p194@railsmaster/bundler/gems/active_record_deprecated_finders-59a4f84c48be/lib/active_record_deprecated_finders/relation.rb:119:in `find'
    test/cases/locking_test.rb:372:in `block (2 levels) in test_eager_find_with_lock'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:192:in `transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/transactions.rb:208:in `transaction'
    test/cases/locking_test.rb:371:in `block in test_eager_find_with_lock'
    /home/yahonda/git/rails/activesupport/lib/active_support/test_case.rb:52:in `assert_nothing_raised'
    test/cases/locking_test.rb:370:in `test_eager_find_with_lock'
    /home/yahonda/.rvm/gems/ruby-1.9.3-p194@railsmaster/gems/mocha-0.11.3/lib/mocha/integration/mini_test/version_230_to_262.rb:28:in `run'
    /home/yahonda/git/rails/activesupport/lib/active_support/testing/setup_and_teardown.rb:29:in `block in run'
    /home/yahonda/git/rails/activesupport/lib/active_support/callbacks.rb:354:in `_run__4574323970468579703__setup__callbacks'
    /home/yahonda/git/rails/activesupport/lib/active_support/callbacks.rb:80:in `run_callbacks'
    /home/yahonda/git/rails/activesupport/lib/active_support/testing/setup_and_teardown.rb:28:in `run'

  2) Error:
test_sane_find_with_lock(PessimisticLockingTest):
ActiveRecord::StatementInvalid: OCIError: ORA-00907: missing right parenthesis: SELECT * FROM (SELECT  "PEOPLE".* FROM "PEOPLE"  WHERE "PEOPLE"."ID" = :a1 ORDER BY "PEOPLE"."ID" ASC FOR UPDATE) WHERE ROWNUM <= 1
    stmt.c:253:in oci8lib_191.so
    /home/yahonda/.rvm/gems/ruby-1.9.3-p194@railsmaster/gems/ruby-oci8-2.1.2/lib/oci8/oci8.rb:474:in `exec'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_oci_connection.rb:143:in `exec'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_adapter.rb:639:in `block in exec_query'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:288:in `block in log'
    /home/yahonda/git/rails/activesupport/lib/active_support/notifications/instrumenter.rb:18:in `instrument'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:283:in `log'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_adapter.rb:1322:in `log'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_adapter.rb:619:in `exec_query'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_adapter.rb:1276:in `select'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:18:in `select_all'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/query_cache.rb:63:in `select_all'
    /home/yahonda/git/rails/activerecord/lib/active_record/querying.rb:40:in `block in find_by_sql'
    /home/yahonda/git/rails/activerecord/lib/active_record/explain.rb:37:in `logging_query_plan'
    /home/yahonda/git/rails/activerecord/lib/active_record/querying.rb:39:in `find_by_sql'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation.rb:174:in `exec_queries'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation.rb:164:in `block in to_a'
    /home/yahonda/git/rails/activerecord/lib/active_record/explain.rb:37:in `logging_query_plan'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation.rb:163:in `to_a'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:365:in `find_first'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:99:in `first'
    /home/yahonda/.rvm/gems/ruby-1.9.3-p194@railsmaster/bundler/gems/active_record_deprecated_finders-59a4f84c48be/lib/active_record_deprecated_finders/relation.rb:126:in `first'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:313:in `find_one'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:299:in `find_with_ids'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:40:in `find'
    /home/yahonda/.rvm/gems/ruby-1.9.3-p194@railsmaster/bundler/gems/active_record_deprecated_finders-59a4f84c48be/lib/active_record_deprecated_finders/relation.rb:119:in `find'
    test/cases/locking_test.rb:361:in `block (2 levels) in test_sane_find_with_lock'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:192:in `transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/transactions.rb:208:in `transaction'
    test/cases/locking_test.rb:360:in `block in test_sane_find_with_lock'
    /home/yahonda/git/rails/activesupport/lib/active_support/test_case.rb:52:in `assert_nothing_raised'
    test/cases/locking_test.rb:359:in `test_sane_find_with_lock'
    /home/yahonda/.rvm/gems/ruby-1.9.3-p194@railsmaster/gems/mocha-0.11.3/lib/mocha/integration/mini_test/version_230_to_262.rb:28:in `run'
    /home/yahonda/git/rails/activesupport/lib/active_support/testing/setup_and_teardown.rb:29:in `block in run'
    /home/yahonda/git/rails/activesupport/lib/active_support/callbacks.rb:354:in `_run__4574323970468579703__setup__callbacks'
    /home/yahonda/git/rails/activesupport/lib/active_support/callbacks.rb:80:in `run_callbacks'
    /home/yahonda/git/rails/activesupport/lib/active_support/testing/setup_and_teardown.rb:28:in `run'

  3) Error:
test_sane_lock_method(PessimisticLockingTest):
ActiveRecord::StatementInvalid: OCIError: ORA-00907: missing right parenthesis: SELECT * FROM (SELECT  "PEOPLE".* FROM "PEOPLE"  WHERE "PEOPLE"."ID" = :a1 ORDER BY "PEOPLE"."ID" ASC FOR UPDATE) WHERE ROWNUM <= 1
    stmt.c:253:in oci8lib_191.so
    /home/yahonda/.rvm/gems/ruby-1.9.3-p194@railsmaster/gems/ruby-oci8-2.1.2/lib/oci8/oci8.rb:474:in `exec'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_oci_connection.rb:143:in `exec'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_adapter.rb:639:in `block in exec_query'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:288:in `block in log'
    /home/yahonda/git/rails/activesupport/lib/active_support/notifications/instrumenter.rb:18:in `instrument'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:283:in `log'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_adapter.rb:1322:in `log'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_adapter.rb:619:in `exec_query'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_adapter.rb:1276:in `select'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:18:in `select_all'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/query_cache.rb:63:in `select_all'
    /home/yahonda/git/rails/activerecord/lib/active_record/querying.rb:40:in `block in find_by_sql'
    /home/yahonda/git/rails/activerecord/lib/active_record/explain.rb:37:in `logging_query_plan'
    /home/yahonda/git/rails/activerecord/lib/active_record/querying.rb:39:in `find_by_sql'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation.rb:174:in `exec_queries'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation.rb:164:in `block in to_a'
    /home/yahonda/git/rails/activerecord/lib/active_record/explain.rb:37:in `logging_query_plan'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation.rb:163:in `to_a'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:365:in `find_first'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:99:in `first'
    /home/yahonda/.rvm/gems/ruby-1.9.3-p194@railsmaster/bundler/gems/active_record_deprecated_finders-59a4f84c48be/lib/active_record_deprecated_finders/relation.rb:126:in `first'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:313:in `find_one'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:299:in `find_with_ids'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:40:in `find'
    /home/yahonda/.rvm/gems/ruby-1.9.3-p194@railsmaster/bundler/gems/active_record_deprecated_finders-59a4f84c48be/lib/active_record_deprecated_finders/relation.rb:119:in `find'
    /home/yahonda/git/rails/activerecord/lib/active_record/persistence.rb:273:in `block in reload'
    /home/yahonda/git/rails/activerecord/lib/active_record/scoping/default.rb:42:in `block in unscoped'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation.rb:240:in `scoping'
    /home/yahonda/git/rails/activerecord/lib/active_record/scoping/default.rb:42:in `unscoped'
    /home/yahonda/git/rails/activerecord/lib/active_record/persistence.rb:273:in `reload'
    /home/yahonda/git/rails/activerecord/lib/active_record/attribute_methods/dirty.rb:39:in `reload'
    /home/yahonda/git/rails/activerecord/lib/active_record/autosave_association.rb:223:in `reload'
    /home/yahonda/git/rails/activerecord/lib/active_record/locking/pessimistic.rb:62:in `lock!'
    test/cases/locking_test.rb:384:in `block (2 levels) in test_sane_lock_method'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:192:in `transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/transactions.rb:208:in `transaction'
    test/cases/locking_test.rb:381:in `block in test_sane_lock_method'
    /home/yahonda/git/rails/activesupport/lib/active_support/test_case.rb:52:in `assert_nothing_raised'
    test/cases/locking_test.rb:380:in `test_sane_lock_method'
    /home/yahonda/.rvm/gems/ruby-1.9.3-p194@railsmaster/gems/mocha-0.11.3/lib/mocha/integration/mini_test/version_230_to_262.rb:28:in `run'
    /home/yahonda/git/rails/activesupport/lib/active_support/testing/setup_and_teardown.rb:29:in `block in run'
    /home/yahonda/git/rails/activesupport/lib/active_support/callbacks.rb:354:in `_run__4574323970468579703__setup__callbacks'
    /home/yahonda/git/rails/activesupport/lib/active_support/callbacks.rb:80:in `run_callbacks'
    /home/yahonda/git/rails/activesupport/lib/active_support/testing/setup_and_teardown.rb:28:in `run'

  4) Error:
test_with_lock_commits_transaction(PessimisticLockingTest):
ActiveRecord::StatementInvalid: OCIError: ORA-00907: missing right parenthesis: SELECT * FROM (SELECT  "PEOPLE".* FROM "PEOPLE"  WHERE "PEOPLE"."ID" = :a1 ORDER BY "PEOPLE"."ID" ASC FOR UPDATE) WHERE ROWNUM <= 1
    stmt.c:253:in oci8lib_191.so
    /home/yahonda/.rvm/gems/ruby-1.9.3-p194@railsmaster/gems/ruby-oci8-2.1.2/lib/oci8/oci8.rb:474:in `exec'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_oci_connection.rb:143:in `exec'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_adapter.rb:639:in `block in exec_query'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:288:in `block in log'
    /home/yahonda/git/rails/activesupport/lib/active_support/notifications/instrumenter.rb:18:in `instrument'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:283:in `log'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_adapter.rb:1322:in `log'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_adapter.rb:619:in `exec_query'
    /home/yahonda/git/oracle-enhanced/lib/active_record/connection_adapters/oracle_enhanced_adapter.rb:1276:in `select'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:18:in `select_all'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/query_cache.rb:63:in `select_all'
    /home/yahonda/git/rails/activerecord/lib/active_record/querying.rb:40:in `block in find_by_sql'
    /home/yahonda/git/rails/activerecord/lib/active_record/explain.rb:37:in `logging_query_plan'
    /home/yahonda/git/rails/activerecord/lib/active_record/querying.rb:39:in `find_by_sql'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation.rb:174:in `exec_queries'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation.rb:164:in `block in to_a'
    /home/yahonda/git/rails/activerecord/lib/active_record/explain.rb:37:in `logging_query_plan'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation.rb:163:in `to_a'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:365:in `find_first'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:99:in `first'
    /home/yahonda/.rvm/gems/ruby-1.9.3-p194@railsmaster/bundler/gems/active_record_deprecated_finders-59a4f84c48be/lib/active_record_deprecated_finders/relation.rb:126:in `first'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:313:in `find_one'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:299:in `find_with_ids'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation/finder_methods.rb:40:in `find'
    /home/yahonda/.rvm/gems/ruby-1.9.3-p194@railsmaster/bundler/gems/active_record_deprecated_finders-59a4f84c48be/lib/active_record_deprecated_finders/relation.rb:119:in `find'
    /home/yahonda/git/rails/activerecord/lib/active_record/persistence.rb:273:in `block in reload'
    /home/yahonda/git/rails/activerecord/lib/active_record/scoping/default.rb:42:in `block in unscoped'
    /home/yahonda/git/rails/activerecord/lib/active_record/relation.rb:240:in `scoping'
    /home/yahonda/git/rails/activerecord/lib/active_record/scoping/default.rb:42:in `unscoped'
    /home/yahonda/git/rails/activerecord/lib/active_record/persistence.rb:273:in `reload'
    /home/yahonda/git/rails/activerecord/lib/active_record/attribute_methods/dirty.rb:39:in `reload'
    /home/yahonda/git/rails/activerecord/lib/active_record/autosave_association.rb:223:in `reload'
    /home/yahonda/git/rails/activerecord/lib/active_record/locking/pessimistic.rb:62:in `lock!'
    /home/yahonda/git/rails/activerecord/lib/active_record/locking/pessimistic.rb:71:in `block in with_lock'
    /home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract/database_statements.rb:192:in `transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/transactions.rb:208:in `transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/transactions.rb:232:in `transaction'
    /home/yahonda/git/rails/activerecord/lib/active_record/locking/pessimistic.rb:70:in `with_lock'
    test/cases/locking_test.rb:392:in `test_with_lock_commits_transaction'
    /home/yahonda/.rvm/gems/ruby-1.9.3-p194@railsmaster/gems/mocha-0.11.3/lib/mocha/integration/mini_test/version_230_to_262.rb:28:in `run'
    /home/yahonda/git/rails/activesupport/lib/active_support/testing/setup_and_teardown.rb:29:in `block in run'
    /home/yahonda/git/rails/activesupport/lib/active_support/callbacks.rb:354:in `_run__4574323970468579703__setup__callbacks'
    /home/yahonda/git/rails/activesupport/lib/active_support/callbacks.rb:80:in `run_callbacks'
    /home/yahonda/git/rails/activesupport/lib/active_support/testing/setup_and_teardown.rb:28:in `run'

31 tests, 104 assertions, 0 failures, 4 errors, 0 skips
$
```

