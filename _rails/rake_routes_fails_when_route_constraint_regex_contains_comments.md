---
title: rake routes fails when route constraint regex contains comments
labels: actionpack
layout: issue
---

When the constraint regex on a route contains comments, `rake routes` fails with the following error:

```
RegexpError: end pattern with unmatched parenthesis: /^\/entry\/((?x-mi:[a-f\d]{8}-[a-f\d]{4}-[1-5]#Version:http:\/\/tools.ietf.org\/html\/rfc4122#section-4.1.3[a-f\d]{3}-[89ab]#Variant:http:\/\/tools.ietf.org\/html\/rfc4122#section-4.1.1[a-f\d]{3}-[a-f\d]{12}))$/
    from /usr/lib/rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/actionpack-4.1.5/lib/action_dispatch/routing/inspector.rb:52:in `initialize'
    from /usr/lib/rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/actionpack-4.1.5/lib/action_dispatch/routing/inspector.rb:52:in `new'
    from /usr/lib/rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/actionpack-4.1.5/lib/action_dispatch/routing/inspector.rb:52:in `json_regexp'
    from /usr/lib/rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/actionpack-4.1.5/lib/action_dispatch/routing/inspector.rb:133:in `block in collect_routes'
    from /usr/lib/rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/actionpack-4.1.5/lib/action_dispatch/routing/inspector.rb:126:in `collect'
    from /usr/lib/rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/actionpack-4.1.5/lib/action_dispatch/routing/inspector.rb:126:in `collect_routes'
    from /usr/lib/rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/actionpack-4.1.5/lib/action_dispatch/routing/inspector.rb:93:in `format'
    from (irb):4
    from /usr/lib/rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/railties-4.1.5/lib/rails/commands/console.rb:90:in `start'
    from /usr/lib/rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/railties-4.1.5/lib/rails/commands/console.rb:9:in `start'
    from /usr/lib/rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/railties-4.1.5/lib/rails/commands/commands_tasks.rb:69:in `console'
    from /usr/lib/rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/railties-4.1.5/lib/rails/commands/commands_tasks.rb:40:in `run_command!'
    from /usr/lib/rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/railties-4.1.5/lib/rails/commands.rb:17:in `<top (required)>'
    from bin/rails:4:in `require'
    from bin/rails:4:in `<main>'
```

The code in question is [here](https://github.com/alphagov/content-register/blob/2ced4612654a0a18d97b881a6ee52684f76a0c2f/config/routes.rb#L4) and as follows:

``` ruby
Rails.application.routes.draw do
  with_options :format => false do |r|
    r.get '/entries' => 'entries#index'
    r.put '/entry/:content_id' => 'entries#update', constraints: { content_id: Entry::UUID_REGEX }

    r.get '/healthcheck' => proc {|env| [200, {}, ["OK"]]}
  end
end
```

The regex is [here](https://github.com/alphagov/content-register/blob/2ced4612654a0a18d97b881a6ee52684f76a0c2f/app/models/entry.rb#L4) and as follows:

``` ruby
UUID_REGEX = %r{
    [a-f\d]{8}
    -
    [a-f\d]{4}
    -
    [1-5]   # Version: http://tools.ietf.org/html/rfc4122#section-4.1.3
    [a-f\d]{3}
    -
    [89ab]  # Variant: http://tools.ietf.org/html/rfc4122#section-4.1.1
    [a-f\d]{3}
    -
    [a-f\d]{12}
  }x
```

The line that it fails on in the source is [here](https://github.com/rails/rails/blob/v4.1.5/actionpack/lib/action_dispatch/routing/inspector.rb#L52). I know this isn't the latest version of Rails but that method looks like it hasn't changed at all compared to [master](https://github.com/rails/rails/blob/master/actionpack/lib/action_dispatch/routing/inspector.rb#L45).

