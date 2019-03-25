---
title: Rack::Runtime can only be disabled in an initializer
labels: railties
layout: issue
---

This is an extension of #1043

Normally you load and unload Rack middlware inside `config/application.rb` or an environment config.
However, `Rack::Runtime` can't be deleted inside `config/application.rb` because an internal part of `railties` assumes that it's there.

Here's the an example stacktrace you get if you try to `config.middleware.delete Rack::Runtime` inside `config/application.rb`:

``` text
/Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/actionpack-4.1.4/lib/action_dispatch/middleware/stack.rb:125:in `assert_index': No such middleware to insert before: "Rack::Runtime" (RuntimeError)
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/actionpack-4.1.4/lib/action_dispatch/middleware/stack.rb:88:in `insert'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/railties-4.1.4/lib/rails/configuration.rb:68:in `block in merge_into'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/railties-4.1.4/lib/rails/configuration.rb:67:in `each'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/railties-4.1.4/lib/rails/configuration.rb:67:in `merge_into'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/railties-4.1.4/lib/rails/engine.rb:497:in `app'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/railties-4.1.4/lib/rails/application/finisher.rb:36:in `block in <module:Finisher>'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/railties-4.1.4/lib/rails/initializable.rb:30:in `instance_exec'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/railties-4.1.4/lib/rails/initializable.rb:30:in `run'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/railties-4.1.4/lib/rails/initializable.rb:55:in `block in run_initializers'
    from /usr/local/var/rbenv/versions/2.1.2/lib/ruby/2.1.0/tsort.rb:226:in `block in tsort_each'
    from /usr/local/var/rbenv/versions/2.1.2/lib/ruby/2.1.0/tsort.rb:348:in `block (2 levels) in each_strongly_connected_component'
    from /usr/local/var/rbenv/versions/2.1.2/lib/ruby/2.1.0/tsort.rb:427:in `each_strongly_connected_component_from'
    from /usr/local/var/rbenv/versions/2.1.2/lib/ruby/2.1.0/tsort.rb:347:in `block in each_strongly_connected_component'
    from /usr/local/var/rbenv/versions/2.1.2/lib/ruby/2.1.0/tsort.rb:345:in `each'
    from /usr/local/var/rbenv/versions/2.1.2/lib/ruby/2.1.0/tsort.rb:345:in `call'
    from /usr/local/var/rbenv/versions/2.1.2/lib/ruby/2.1.0/tsort.rb:345:in `each_strongly_connected_component'
    from /usr/local/var/rbenv/versions/2.1.2/lib/ruby/2.1.0/tsort.rb:224:in `tsort_each'
    from /usr/local/var/rbenv/versions/2.1.2/lib/ruby/2.1.0/tsort.rb:205:in `tsort_each'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/railties-4.1.4/lib/rails/initializable.rb:54:in `run_initializers'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/railties-4.1.4/lib/rails/application.rb:300:in `initialize!'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/railties-4.1.4/lib/rails/railtie.rb:194:in `public_send'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/railties-4.1.4/lib/rails/railtie.rb:194:in `method_missing'
    from /Users/Csuhta/Projects/project-name/config/environment.rb:5:in `<top (required)>'
    from config.ru:3:in `require'
    from config.ru:3:in `block in <main>'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/rack-1.5.2/lib/rack/builder.rb:55:in `instance_eval'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/rack-1.5.2/lib/rack/builder.rb:55:in `initialize'
    from config.ru:1:in `new'
    from config.ru:1:in `<main>'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/unicorn-4.8.3/lib/unicorn.rb:48:in `eval'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/unicorn-4.8.3/lib/unicorn.rb:48:in `block in builder'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/unicorn-4.8.3/lib/unicorn/http_server.rb:764:in `call'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/unicorn-4.8.3/lib/unicorn/http_server.rb:764:in `build_app!'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/unicorn-4.8.3/lib/unicorn/http_server.rb:137:in `start'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/gems/unicorn-4.8.3/bin/unicorn:126:in `<top (required)>'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/bin/unicorn:23:in `load'
    from /Users/Csuhta/Projects/project-name/vendor/bundle/ruby/2.1.0/bin/unicorn:23:in `<main>'
```

The solution is to write an initializer such as

``` ruby
# config/initalizers/disable_rack_runtime.rb
Rails.application.config.middleware.delete Rack::Runtime
```

but this is counter-inutative and against the instructions in the [Rails Guide](http://guides.rubyonrails.org/rails_on_rack.html).

I feel that `Rack::Runtime` shouldn't be considered essential by any part of Rails or assumed to exist.

