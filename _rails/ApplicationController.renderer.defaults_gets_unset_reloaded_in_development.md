---
title: ApplicationController.renderer.defaults gets unset/reloaded in development
labels: good-first-patch, railties
layout: issue
---

Using the new `config/initializers/application_controller_renderer.rb` example to set the default `http_host` for ApplicationController is largely ineffective in development. This might not be the case for production, but if it can't work in development I can't use it in production. ;)

```ruby
ApplicationController.renderer.defaults.merge!(
  http_host: 'super.example.org',
  https: true
)

# bin/rails console
ApplicationController.renderer.defaults[:http_host] #=> "super.example.org"
reload!
ApplicationController.renderer.defaults[:http_host] #=> "example.org"
```

This may be related to #22975 or #24661 where `DEFAULTS.dup` was introduced to allow for modification of the defaults hash (which was frozen).

Using: Rails 5.1.1, Ruby 2.4.1
