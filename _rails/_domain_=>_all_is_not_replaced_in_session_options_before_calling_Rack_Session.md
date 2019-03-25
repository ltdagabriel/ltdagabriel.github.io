---
title: :domain => :all is not replaced in session options before calling Rack:Session
labels: actionpack
layout: issue
---

Referring to Rails 3.1.0.

I was getting crashes in Rack due to `:domain` being set to `:all` in development, when using a custom session store.  It turns out that Rails is subclassing Rack's built-in session class, and passing along (most of) the options verbatim.  This includes the `:domain` option, which can be `:all`.  Rack then tries to use the `:all` Symbol in a String context, which crashes Rack.

I have monkey patched this behaviour into my own installation:

``` ruby
class ActionDispatch::Session::AbstractStore
  def call(env)
    # the only place I could find that knows how to mutate out the `:all` was the CookieJar, so we use that before Rack gets an invalid :domain
    ActionDispatch::Request.new(env).cookie_jar.handle_options(@default_options)
    super
  end
end
```

I know you'll want a proper patch and some test coverage, which I will give you, but if anybody can either resolve this in a better way, or use my code from above, before I get a chance, please be my guest! :)

