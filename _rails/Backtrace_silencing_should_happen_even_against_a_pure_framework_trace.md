---
title: Backtrace silencing should happen even against a pure framework trace
labels: attached PR, railties
layout: issue
---

When an exception is raised where the backtrace doesn't include user code, we default to showing the whole thing. That results in stuff like this:

```
irb(main):011:0> eit
NameError: undefined local variable or method `eit' for main:Object
Did you mean?  exit
    from (irb):11
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/railties-5.0.0.rc1/lib/rails/commands/console.rb:65:in `start'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/railties-5.0.0.rc1/lib/rails/commands/console_helper.rb:9:in `start'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/railties-5.0.0.rc1/lib/rails/commands/commands_tasks.rb:78:in `console'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/railties-5.0.0.rc1/lib/rails/commands/commands_tasks.rb:49:in `run_command!'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/railties-5.0.0.rc1/lib/rails/commands.rb:18:in `<top (required)>'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.rc1/lib/active_support/dependencies.rb:293:in `require'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.rc1/lib/active_support/dependencies.rb:293:in `block in require'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.rc1/lib/active_support/dependencies.rb:259:in `load_dependency'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.rc1/lib/active_support/dependencies.rb:293:in `require'
    from /Users/david/Code/demos/blog/bin/rails:9:in `<top (required)>'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.rc1/lib/active_support/dependencies.rb:287:in `load'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.rc1/lib/active_support/dependencies.rb:287:in `block in load'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.rc1/lib/active_support/dependencies.rb:259:in `load_dependency'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/activesupport-5.0.0.rc1/lib/active_support/dependencies.rb:287:in `load'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/spring-1.7.1/lib/spring/commands/rails.rb:6:in `call'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/spring-1.7.1/lib/spring/command_wrapper.rb:38:in `call'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/spring-1.7.1/lib/spring/application.rb:191:in `block in serve'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/spring-1.7.1/lib/spring/application.rb:161:in `fork'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/spring-1.7.1/lib/spring/application.rb:161:in `serve'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/spring-1.7.1/lib/spring/application.rb:131:in `block in run'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/spring-1.7.1/lib/spring/application.rb:125:in `loop'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/spring-1.7.1/lib/spring/application.rb:125:in `run'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/spring-1.7.1/lib/spring/application/boot.rb:19:in `<top (required)>'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/2.3.0/rubygems/core_ext/kernel_require.rb:55:in `require'
    from /Users/david/.rbenv/versions/2.3.1/lib/ruby/2.3.0/rubygems/core_ext/kernel_require.rb:55:in `require'
    from -e:1:in `<main>'
```

That's not a reasonable response to something so simple. I'd like to see:

```
irb(main):011:0> eit
NameError: undefined local variable or method `eit' for main:Object
Did you mean?  exit
[Backtrace silenced by Rails. Tweak config/initializers/backtrace_silencer.rb if needed]
```

