---
title: ActionController::Metal response includes the default headers
labels: With reproduction steps, actionpack, attached PR, regression
layout: issue
---

Creating a controller that inherits from `ActionController::Metal` adds the default headers from `ActionDispatch` to the response when it should not be adding anything. `ActionController::Metal` should be opt-in for these headers instead of having them added by default.

This commit e16afe61abd78c55f80752ca020b90d59ae1940f appears to be where it originated and, in particular, changing `ActionDispatch::Response.new` to `ActionDispatch::Response.create` [here](https://github.com/rails/rails/blob/master/actionpack/lib/action_controller/metal.rb#L137)

I've created a gist with a minimal test showing the issue: https://gist.github.com/zspoelstra/b2269d44e643d597eae807f61681a2e5
### Expected behavior

The response headers should not include the default headers.
### Actual behavior

`X-Frame-Options`, `X-XSS-Protection`, and `X-Content-Type-Options` headers are added to the response
### System configuration

**Rails version**: 5.0.0

**Ruby version**: 2.3.0

