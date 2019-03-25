---
title: connection.select_all binds regression
labels: activerecord, attached PR, regression
layout: issue
---

### Steps to reproduce
```
rails new test
cd test
rails g model post body:string
rake db:migrate
rails console
Post.connection.select_all('SELECT id FROM posts WHERE id > $1', 'SQL', [[nil, 0]])
```

### Expected behavior
This normally work in Rails 4.2.7.1

### Actual behavior
```
NoMethodError: undefined method `value_for_database' for [nil, 0]:Array
        from ~/.rvm/gems/ruby-2.3.1/gems/activerecord-5.0.1/lib/active_record/connection_adapters/sqlite3_adapter.rb:191:in `block in exec_query'
        from ~/.rvm/gems/ruby-2.3.1/gems/activerecord-5.0.1/lib/active_record/connection_adapters/sqlite3_adapter.rb:191:in `map'
        from ~/.rvm/gems/ruby-2.3.1/gems/activerecord-5.0.1/lib/active_record/connection_adapters/sqlite3_adapter.rb:191:in `exec_query'
        from ~/.rvm/gems/ruby-2.3.1/gems/activerecord-5.0.1/lib/active_record/connection_adapters/abstract/database_statements.rb:373:in `select'
        from ~/.rvm/gems/ruby-2.3.1/gems/activerecord-5.0.1/lib/active_record/connection_adapters/abstract/database_statements.rb:41:in `select_all'
        from ~/.rvm/gems/ruby-2.3.1/gems/activerecord-5.0.1/lib/active_record/connection_adapters/abstract/query_cache.rb:95:in `select_all'
        from (irb):1
        from ~/.rvm/gems/ruby-2.3.1/gems/railties-5.0.1/lib/rails/commands/console.rb:65:in `start'
        from ~/.rvm/gems/ruby-2.3.1/gems/railties-5.0.1/lib/rails/commands/console_helper.rb:9:in `start'
        from ~/.rvm/gems/ruby-2.3.1/gems/railties-5.0.1/lib/rails/commands/commands_tasks.rb:78:in `console'
        from ~/.rvm/gems/ruby-2.3.1/gems/railties-5.0.1/lib/rails/commands/commands_tasks.rb:49:in `run_command!'
        from ~/.rvm/gems/ruby-2.3.1/gems/railties-5.0.1/lib/rails/commands.rb:18:in `<top (required)>'
        from ~/.rvm/gems/ruby-2.3.1/gems/activesupport-5.0.1/lib/active_support/dependencies.rb:293:in `require'
        from ~/.rvm/gems/ruby-2.3.1/gems/activesupport-5.0.1/lib/active_support/dependencies.rb:293:in `block in require'
        from ~/.rvm/gems/ruby-2.3.1/gems/activesupport-5.0.1/lib/active_support/dependencies.rb:259:in `load_dependency'
        from ~/.rvm/gems/ruby-2.3.1/gems/activesupport-5.0.1/lib/active_support/dependencies.rb:293:in `require'
... 1 levels...
        from ~/.rvm/gems/ruby-2.3.1/gems/activesupport-5.0.1/lib/active_support/dependencies.rb:287:in `load'
        from ~/.rvm/gems/ruby-2.3.1/gems/activesupport-5.0.1/lib/active_support/dependencies.rb:287:in `block in load'
        from ~/.rvm/gems/ruby-2.3.1/gems/activesupport-5.0.1/lib/active_support/dependencies.rb:259:in `load_dependency'
        from ~/.rvm/gems/ruby-2.3.1/gems/activesupport-5.0.1/lib/active_support/dependencies.rb:287:in `load'
        from ~/.rvm/gems/ruby-2.3.1/gems/spring-2.0.1/lib/spring/commands/rails.rb:6:in `call'
        from ~/.rvm/gems/ruby-2.3.1/gems/spring-2.0.1/lib/spring/command_wrapper.rb:38:in `call'
        from ~/.rvm/gems/ruby-2.3.1/gems/spring-2.0.1/lib/spring/application.rb:191:in `block in serve'
        from ~/.rvm/gems/ruby-2.3.1/gems/spring-2.0.1/lib/spring/application.rb:161:in `fork'
        from ~/.rvm/gems/ruby-2.3.1/gems/spring-2.0.1/lib/spring/application.rb:161:in `serve'
        from ~/.rvm/gems/ruby-2.3.1/gems/spring-2.0.1/lib/spring/application.rb:131:in `block in run'
        from ~/.rvm/gems/ruby-2.3.1/gems/spring-2.0.1/lib/spring/application.rb:125:in `loop'
        from ~/.rvm/gems/ruby-2.3.1/gems/spring-2.0.1/lib/spring/application.rb:125:in `run'
        from ~/.rvm/gems/ruby-2.3.1/gems/spring-2.0.1/lib/spring/application/boot.rb:19:in `<top (required)>'
        from ~/.rvm/rubies/ruby-2.3.1/lib/ruby/site_ruby/2.3.0/rubygems/core_ext/kernel_require.rb:55:in `require'
        from ~/.rvm/rubies/ruby-2.3.1/lib/ruby/site_ruby/2.3.0/rubygems/core_ext/kernel_require.rb:55:in `require'
        from -e:1:in `<main>'
```

### System configuration
**Rails version**:
5.0.1
**Ruby version**:
ruby 2.3.1
