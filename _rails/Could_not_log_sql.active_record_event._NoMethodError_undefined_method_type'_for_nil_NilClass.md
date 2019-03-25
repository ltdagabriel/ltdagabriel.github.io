---
title: Could not log "sql.active_record" event. NoMethodError: undefined method `type' for nil:NilClass
labels: activerecord
layout: issue
---

Trying to find a testcase https://github.com/rsim/oracle-enhanced/issues/134 and https://github.com/rsim/oracle-enhanced/pull/252, I've found similar issue exists in rails master branch.
- Tailing the debug.log.

``` ruby
$ cd activerecord
$ tail -f debug.log | grep sql.active_record
```
- Execute this test

``` ruby
$ cd activerecord
$ ARCONN=postgresql ruby -Itest test/cases/adapters/postgresql/postgresql_adapter_test.rb -n test_exec_with_binds
```

Although, this test finishes successfully, `debug.log`  shows this error message.

``` ruby
Could not log "sql.active_record" event. NoMethodError: undefined method `type' for nil:NilClass ["/home/yahonda/git/rails/activerecord/lib/active_record/log_subscriber.rb:24:in `render_bind'", "/home/yahonda/git/rails/activerecord/lib/active_record/log_subscriber.rb:47:in `block in sql'", "/home/yahonda/git/rails/activerecord/lib/active_record/log_subscriber.rb:46:in `map'", "/home/yahonda/git/rails/activerecord/lib/active_record/log_subscriber.rb:46:in `sql'", "/home/yahonda/git/rails/activesupport/lib/active_support/log_subscriber.rb:111:in `finish'", "/home/yahonda/git/rails/activesupport/lib/active_support/notifications/fanout.rb:89:in `finish'", "/home/yahonda/git/rails/activesupport/lib/active_support/notifications/fanout.rb:40:in `block in finish'", "/home/yahonda/git/rails/activesupport/lib/active_support/notifications/fanout.rb:40:in `each'", "/home/yahonda/git/rails/activesupport/lib/active_support/notifications/fanout.rb:40:in `finish'", "/home/yahonda/git/rails/activesupport/lib/active_support/notifications/instrumenter.rb:25:in `ensure in instrument'", "/home/yahonda/git/rails/activesupport/lib/active_support/notifications/instrumenter.rb:25:in `instrument'", "/home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:299:in `log'", "/home/yahonda/git/rails/activerecord/lib/active_record/connection_adapters/postgresql/database_statements.rb:137:in `exec_query'", "test/cases/adapters/postgresql/postgresql_adapter_test.rb:182:in `test_exec_with_binds'", "/home/yahonda/.rvm/gems/ruby-1.9.3-p362@railsmaster/gems/minitest-4.3.3/lib/minitest/unit.rb:1294:in `run'", "/home/yahonda/.rvm/gems/ruby-1.9.3-p362@railsmaster/gems/minitest-4.3.3/lib/minitest/unit.rb:912:in `block in _run_suite'", "/home/yahonda/.rvm/gems/ruby-1.9.3-p362@railsmaster/gems/minitest-4.3.3/lib/minitest/unit.rb:905:in `map'", "/home/yahonda/.rvm/gems/ruby-1.9.3-p362@railsmaster/gems/minitest-4.3.3/lib/minitest/unit.rb:905:in `_run_suite'", "/home/yahonda/.rvm/gems/ruby-1.9.3-p362@railsmaster/gems/minitest-4.3.3/lib/minitest/unit.rb:892:in `block in _run_suites'", "/home/yahonda/.rvm/gems/ruby-1.9.3-p362@railsmaster/gems/minitest-4.3.3/lib/minitest/unit.rb:892:in `map'", "/home/yahonda/.rvm/gems/ruby-1.9.3-p362@railsmaster/gems/minitest-4.3.3/lib/minitest/unit.rb:892:in `_run_suites'", "/home/yahonda/.rvm/gems/ruby-1.9.3-p362@railsmaster/gems/minitest-4.3.3/lib/minitest/unit.rb:860:in `_run_anything'", "/home/yahonda/.rvm/gems/ruby-1.9.3-p362@railsmaster/gems/minitest-4.3.3/lib/minitest/unit.rb:1053:in `run_tests'", "/home/yahonda/.rvm/gems/ruby-1.9.3-p362@railsmaster/gems/minitest-4.3.3/lib/minitest/unit.rb:1040:in `block in _run'", "/home/yahonda/.rvm/gems/ruby-1.9.3-p362@railsmaster/gems/minitest-4.3.3/lib/minitest/unit.rb:1039:in `each'", "/home/yahonda/.rvm/gems/ruby-1.9.3-p362@railsmaster/gems/minitest-4.3.3/lib/minitest/unit.rb:1039:in `_run'", "/home/yahonda/.rvm/gems/ruby-1.9.3-p362@railsmaster/gems/minitest-4.3.3/lib/minitest/unit.rb:1028:in `run'", "/home/yahonda/.rvm/gems/ruby-1.9.3-p362@railsmaster/gems/minitest-4.3.3/lib/minitest/unit.rb:782:in `block in autorun'"]
```

This 'Could not log "sql.active_record" event. NoMethodError: undefined method `type' for nil:NilClass' also appears with following testcases.

``` ruby
$ ARCONN=mysql ruby -Itest test/cases/adapters/mysql/connection_test.rb -n test_exec_with_binds
$ ARCONN=postgresql ruby -Itest test/cases/adapters/postgresql/postgresql_adapter_test.rb -n test_exec_with_binds
$ ARCONN=postgresql ruby -Itest test/cases/adapters/postgresql/schema_authorization_test.rb -n test_auth_with_bind
$ ARCONN=postgresql ruby -Itest test/cases/adapters/postgresql/schema_authorization_test.rb -n test_setting_auth_clears_stmt_cache
$ ARCONN=postgresql ruby -Itest test/cases/adapters/postgresql/schema_test.rb -n test_schema_change_with_prepared_stmt
```

