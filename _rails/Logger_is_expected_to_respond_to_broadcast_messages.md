---
title: Logger is expected to respond to `broadcast_messages`
labels: activesupport
layout: issue
---

The logger method was added by @nwjsmith  in this commit https://github.com/rails/rails/commit/e12ffb76ffcedd150e7d0c3dc4f93472aa4790cb and docs in https://github.com/nwjsmith/rails/commit/5f73c3cd51eb367b07c1a150092e6f8df3bdd759 Rails now expects a logger to have a `broadcast_messages` method. This is a method that does not exist on the other loggers such as the standard lib's logger. When you try to set another logger it will break. Setting your logging to STDOUT for example will be broken:

```
      logger       = ::Logger.new(STDOUT)
      logger       = ActiveSupport::TaggedLogging.new(logger)
```

Since Ruby's stdlib logger does not have a `broadcast_messages` method. 

```
irb(main):004:0> Rails.logger.warn("foo")
NameError: undefined local variable or method `broadcast_messages' for #<RailsStdoutLogging::StdoutLogger:0x007fd3fa901db8>
    from /Users/richardschneeman/.gem/ruby/2.3.0/gems/activesupport-5.0.0.beta1/lib/active_support/logger.rb:14:in `block (2 levels) in broadcast'
    from /Users/richardschneeman/.rubies/ruby-2.3.0-preview2/lib/ruby/2.3.0/logger.rb:497:in `warn'
    from (irb):4
    from /Users/richardschneeman/.gem/ruby/2.3.0/gems/railties-5.0.0.beta1/lib/rails/commands/console.rb:65:in `start'
    from /Users/richardschneeman/.gem/ruby/2.3.0/gems/railties-5.0.0.beta1/lib/rails/commands/console_helper.rb:9:in `start'
    from /Users/richardschneeman/.gem/ruby/2.3.0/gems/railties-5.0.0.beta1/lib/rails/commands/commands_tasks.rb:78:in `console'
    from /Users/richardschneeman/.gem/ruby/2.3.0/gems/railties-5.0.0.beta1/lib/rails/commands/commands_tasks.rb:49:in `run_command!'
    from /Users/richardschneeman/.gem/ruby/2.3.0/gems/railties-5.0.0.beta1/lib/rails/command.rb:20:in `run'
    from /Users/richardschneeman/.gem/ruby/2.3.0/gems/railties-5.0.0.beta1/lib/rails/commands.rb:19:in `<top (required)>'
    from bin/rails:9:in `require'
    from bin/rails:9:in `<main>'
```

