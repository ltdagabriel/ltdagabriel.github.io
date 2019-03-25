---
title: rake dev:cache
labels: pinned, railties
layout: issue
---

It's common to want to test the caching strategy of your app in development mode. A simple pattern to dealing with toggling that on/off is using a file like tmp/caching-dev as a trigger, and then have something like this in config/environments/development.rb:

``` ruby
  if Rails.root.join('tmp/caching-dev').exist?
    config.action_controller.perform_caching = true
    config.static_cache_control = "public, max-age=172800"
    config.cache_store = :mem_cache_store
  else
    config.action_controller.perform_caching = false
    config.cache_store = :null_store
  end
```

Let's expose that pattern fully with a toggle through `rake dev:cache` which will turn caching on if it's off and vice versa. And then output status, like "Development mode is now being cached".

That command also needs to touch tmp/restart.txt (which I also want to wrap up as a command).

