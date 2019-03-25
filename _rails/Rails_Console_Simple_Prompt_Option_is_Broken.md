---
title: Rails Console Simple Prompt Option is Broken
labels: attached PR, railties
layout: issue
---

### Steps to reproduce

Open the rails console with simple-prompt:

```
rails c -- --simple-prompt
```

### Expected behavior

Rails console should open with just >> as the prompt.

### Actual behavior

Unrelated error message is thrown in the console. The flag `config.eager_load` is set in all environments.

```
config.eager_load is set to nil. Please update your config/environments/*.rb files accordingly:

  * development - set it to false
  * test - set it to false (unless you use a tool that preloads your test environment)
  * production - set it to true

/Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/activerecord-5.1.0/lib/active_record/connection_adapters/connection_specification.rb:246:in `resolve_symbol_connection': '--simple-prompt' database is not configured. Available: ["development", "test"] (ActiveRecord::AdapterNotSpecified)
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/activerecord-5.1.0/lib/active_record/connection_adapters/connection_specification.rb:227:in `resolve_connection'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/activerecord-5.1.0/lib/active_record/connection_adapters/connection_specification.rb:141:in `resolve'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/activerecord-5.1.0/lib/active_record/connection_handling.rb:55:in `establish_connection'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/activerecord-5.1.0/lib/active_record/railtie.rb:124:in `block (2 levels) in <class:Railtie>'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/activesupport-5.1.0/lib/active_support/lazy_load_hooks.rb:45:in `instance_eval'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/activesupport-5.1.0/lib/active_support/lazy_load_hooks.rb:45:in `execute_hook'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/activesupport-5.1.0/lib/active_support/lazy_load_hooks.rb:52:in `block in run_load_hooks'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/activesupport-5.1.0/lib/active_support/lazy_load_hooks.rb:51:in `each'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/activesupport-5.1.0/lib/active_support/lazy_load_hooks.rb:51:in `run_load_hooks'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/activerecord-5.1.0/lib/active_record/base.rb:326:in `<module:ActiveRecord>'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/activerecord-5.1.0/lib/active_record/base.rb:25:in `<top (required)>'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/activesupport-5.1.0/lib/active_support/dependencies.rb:292:in `require'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/activesupport-5.1.0/lib/active_support/dependencies.rb:292:in `block in require'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/activesupport-5.1.0/lib/active_support/dependencies.rb:258:in `load_dependency'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/activesupport-5.1.0/lib/active_support/dependencies.rb:292:in `require'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/activerecord-5.1.0/lib/active_record/railtie.rb:52:in `block in <class:Railtie>'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/railties-5.1.0/lib/rails/railtie.rb:228:in `block in run_console_blocks'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/railties-5.1.0/lib/rails/railtie.rb:250:in `each'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/railties-5.1.0/lib/rails/railtie.rb:250:in `each_registered_block'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/railties-5.1.0/lib/rails/railtie.rb:228:in `run_console_blocks'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/railties-5.1.0/lib/rails/application.rb:460:in `block in run_console_blocks'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/railties-5.1.0/lib/rails/engine/railties.rb:13:in `each'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/railties-5.1.0/lib/rails/engine/railties.rb:13:in `each'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/railties-5.1.0/lib/rails/application.rb:460:in `run_console_blocks'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/railties-5.1.0/lib/rails/engine.rb:442:in `load_console'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/railties-5.1.0/lib/rails/commands/console/console_command.rb:27:in `initialize'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/railties-5.1.0/lib/rails/commands/console/console_command.rb:17:in `new'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/railties-5.1.0/lib/rails/commands/console/console_command.rb:17:in `start'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/railties-5.1.0/lib/rails/commands/console/console_command.rb:85:in `perform'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/thor-0.19.4/lib/thor/command.rb:27:in `run'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/thor-0.19.4/lib/thor/invocation.rb:126:in `invoke_command'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/thor-0.19.4/lib/thor.rb:369:in `dispatch'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/railties-5.1.0/lib/rails/command/base.rb:63:in `perform'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/railties-5.1.0/lib/rails/command.rb:44:in `invoke'
	from /Users/bparanj/.rvm/gems/ruby-2.4.0@r51/gems/railties-5.1.0/lib/rails/commands.rb:16:in `<top (required)>'
	from bin/rails:4:in `require'
	from bin/rails:4:in `<main>'
```


### System configuration

**Rails version**:

Rails 5.1.0

**Ruby version**:

ruby 2.4.0p0 (2016-12-24 revision 57164) [x86_64-darwin13]

