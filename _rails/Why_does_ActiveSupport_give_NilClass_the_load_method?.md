---
title: Why does ActiveSupport give NilClass the #load method?
labels: activesupport
layout: issue
---

So imagine this:

You've got a middleware that takes `Content-Type` request header and figures out what Deserializer class to use, based on a mapping.

Example:

``` ruby
use(Middleware, {
  "application/json" => JSON
})
```

However this middleware doesn't handle bad keys because presumably it wouldn't matter:

``` ruby
class Middleware
  def call(env)
    if content_type
      deserializer_class.load(payload)
    end
  end
end
```

If it couldn't find the key, then `deserializer_class` would be `nil` and `NilClass` doesn't implement `#load`.

Except now it does, and more importantly the `NilClass#load` method tries to look up a file based on the data in `payload`.

Now sadly, since I'm using ActiveRecord I can't tell ActiveSupport not to do this to me, and my only solution is to "nil check" the `deserializer_class` value.

