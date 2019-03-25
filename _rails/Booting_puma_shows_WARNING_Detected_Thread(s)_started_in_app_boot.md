---
title: Booting puma shows "WARNING: Detected 21 Thread(s) started in app boot"
labels: activesupport, attached PR, needs feedback
layout: issue
---

### Steps to reproduce

I'm just spinning up a brand new Rails 5 project to kick the tyres and find out what's new. It comes with puma by default (which is awesome, and saves me installing it later!). Straight out of the box, it works fine. Then I follow the [Heroku guidelines for configuring it](https://devcenter.heroku.com/articles/deploying-rails-applications-with-the-puma-web-server), which essentially boils down to uncommenting the following lines in `config/puma.rb`:

``` ruby
workers ENV.fetch("WEB_CONCURRENCY") { 2 }
preload_app!
on_worker_boot do
  ActiveRecord::Base.establish_connection if defined?(ActiveRecord)
end
```

Now when I boot the server, with `bundle exec puma -C config/puma.rb` I get:

```
[15663] Puma starting in cluster mode...
[15663] * Version 3.4.0 (ruby 2.3.1-p112), codename: Owl Bowl Brawl
[15663] * Min threads: 5, max threads: 5
[15663] * Environment: development
[15663] * Process workers: 2
[15663] * Preloading application
[15663] * Listening on tcp://0.0.0.0:3000
[15663] ! WARNING: Detected 21 Thread(s) started in app boot:
[15663] ! #<Thread:0x007fe40cd38040@/Users/mathie/.rbenv/versions/2.3.1/lib/ruby/gems/2.3.0/gems/listen-3.0.8/lib/listen/internals/thread_pool.rb:6 sleep> - /Users/mathie/.rbenv/versions/2.3.1/lib/ruby/ge
ms/2.3.0/gems/rb-fsevent-0.9.7/lib/rb-fsevent/fsevent.rb:42:in `select'
[ ... repeated, presumably ~20 more times ...]
[15663] Use Ctrl-C to stop
[15663] - Worker 1 (pid: 15707) booted, phase: 0
[15663] - Worker 0 (pid: 15706) booted, phase: 0
```

The bit that bothers me is the warning about multiple threads, in case that wasn't clear.

If I were to hazard a guess, I'd say whatever's new in Rails 5 that has introduced the dependency on `listen` is responsible for this, but I don't know what that is. I also don't know if it needs its threads restarted `on_worker_boot` or whether Rails already handles that correctly, automatically. It would be ace if, between you and the Puma team, you could figure out how to elide the warning. I don't like ignoring warnings!

Having written this up, I suspect I should be submitting an issue to the Rails repo instead, but since it's now such little effort to do so, I'm going to flag it up here, too. 😄 
### Expected behavior

I expect a brand new Rails app, configured to run in a popular deployment scenario, to boot with zero warnings.
### Actual behavior

In reality, with what I believe is a fairly standard deployment configuration, the Rails app boots with several warnings, as shown above, which is a suboptimal new user experience.
### System configuration

**Rails version**: 5.0.0.rc1

**Ruby version**: 2.3.1

