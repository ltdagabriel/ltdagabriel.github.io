---
title: redirect behavior change with path: not documented
labels: actionpack, attached PR, docs
layout: issue
---

given this route:

```ruby
get "/user/sign-in", to: redirect("/sign-in")
```

`/user/sign-in?foo=bar` will redirect to `/sign-in`

given this route:

```ruby
get "/user/sign-in", to: redirect(path: "/sign-in")
```

`/user/sign-in?foo=bar` will redirect to `/sign-in?foo=bar`

[This test](https://github.com/rails/rails/blob/master/actionpack/test/dispatch/routing_test.rb#L291-L298) is the closest thing which might suggest this is the intended behavior in the `path:` case. Although the name suggests that it's testing something else and the params are an afterthought. In fact from reading that test one might imagine that params are only carried over by default when the host is being changed in the redirect.

What's the intended behavior? I would have expected those two routes to have identical behavior.

The fact that the `path:` case behaves as such doesn't seem to be documented ([ActionDispatch::Routing::Redirection](http://api.rubyonrails.org/classes/ActionDispatch/Routing/Redirection.html)). I'd like to contribute some documentation, but I don't know the rationale.

Thanks,
John
