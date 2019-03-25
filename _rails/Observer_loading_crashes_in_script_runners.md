---
title: Observer loading crashes in script runners
labels: activerecord
layout: issue
---

``` bash
% rails -v      
Rails 3.2.8
```

This is basically the bug fixed in https://rails.lighthouseapp.com/projects/8994/tickets/5074 for the console, but still present for the script runner context.

Steps to reproduce:

``` bash
rails new ./foo
rails generate model bar
rails generate observer bar
rake db:migrate
```

in application.rb add

``` ruby
config.active_record.observers = :bar_observer
```

create scripts/bar.rb with

``` ruby
Bar.create
```

then run the script

``` bash
rails runner scripts/bar.rb
```

now observe this nice stacktrace:

```
/home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/dependencies.rb:503:in `load_missing_constant': Expected /home/martin/foo/app/models/bar.rb to define Bar (LoadError)
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/dependencies.rb:192:in `block in const_missing'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/dependencies.rb:190:in `each'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/dependencies.rb:190:in `const_missing'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/inflector/methods.rb:230:in `block in constantize'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/inflector/methods.rb:229:in `each'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/inflector/methods.rb:229:in `constantize'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/core_ext/string/inflections.rb:54:in `constantize'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activemodel-3.2.8/lib/active_model/observing.rb:210:in `observed_class'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activemodel-3.2.8/lib/active_model/observing.rb:203:in `observed_classes'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activemodel-3.2.8/lib/active_model/observing.rb:223:in `observed_classes'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activerecord-3.2.8/lib/active_record/observer.rb:96:in `observed_classes'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activemodel-3.2.8/lib/active_model/observing.rb:219:in `initialize'
    from /home/martin/.rvm/rubies/ruby-1.9.3-p194/lib/ruby/1.9.1/singleton.rb:141:in `new'
    from /home/martin/.rvm/rubies/ruby-1.9.3-p194/lib/ruby/1.9.1/singleton.rb:141:in `block in instance'
    from <internal:prelude>:10:in `synchronize'
    from /home/martin/.rvm/rubies/ruby-1.9.3-p194/lib/ruby/1.9.1/singleton.rb:139:in `instance'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activemodel-3.2.8/lib/active_model/observing.rb:86:in `instantiate_observer'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activemodel-3.2.8/lib/active_model/observing.rb:59:in `block in instantiate_observers'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activemodel-3.2.8/lib/active_model/observing.rb:59:in `each'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activemodel-3.2.8/lib/active_model/observing.rb:59:in `instantiate_observers'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activerecord-3.2.8/lib/active_record/railtie.rb:117:in `block (2 levels) in <class:Railtie>'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/lazy_load_hooks.rb:36:in `instance_eval'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/lazy_load_hooks.rb:36:in `execute_hook'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/lazy_load_hooks.rb:43:in `block in run_load_hooks'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/lazy_load_hooks.rb:42:in `each'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/lazy_load_hooks.rb:42:in `run_load_hooks'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activerecord-3.2.8/lib/active_record/base.rb:721:in `<top (required)>'
    from /home/martin/foo/app/models/bar.rb:1:in `<top (required)>'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/dependencies.rb:469:in `load'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/dependencies.rb:469:in `block in load_file'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/dependencies.rb:639:in `new_constants_in'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/dependencies.rb:468:in `load_file'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/dependencies.rb:353:in `require_or_load'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/dependencies.rb:502:in `load_missing_constant'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/dependencies.rb:192:in `block in const_missing'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/dependencies.rb:190:in `each'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/activesupport-3.2.8/lib/active_support/dependencies.rb:190:in `const_missing'
    from script/bar.rb:1:in `<top (required)>'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/railties-3.2.8/lib/rails/commands/runner.rb:51:in `eval'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/railties-3.2.8/lib/rails/commands/runner.rb:51:in `<top (required)>'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/railties-3.2.8/lib/rails/commands.rb:64:in `require'
    from /home/martin/.rvm/gems/ruby-1.9.3-p194/gems/railties-3.2.8/lib/rails/commands.rb:64:in `<top (required)>'
    from script/rails:6:in `require'
    from script/rails:6:in `<main>'
```

