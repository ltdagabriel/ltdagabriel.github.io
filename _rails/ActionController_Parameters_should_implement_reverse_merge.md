---
title: ActionController::Parameters should implement `reverse_merge`
labels: actionpack, attached PR
layout: issue
---

#`reverse_merge` is useful for setting defaults in hashes (and also controller parameters). `Parameters` already implements `merge`, so it should likely implement `reverse_merge` as well.

### Steps to reproduce

```ruby
params = ActionController::Parameters.new({ foo: :bar })
defaults = { baz: :bang }
params.reverse_merge(defaults)
```

### Expected behavior

No deprecations

### Actual behavior

> DEPRECATION WARNING: Method reverse_merge is deprecated and will be removed in Rails 5.1, as `ActionController::Parameters` no longer inherits from hash. Using this deprecated behavior exposes potential security problems. If you continue to use this method you may be creating a security vulnerability in your app that can be exploited. Instead, consider using one of these documented methods which are not deprecated: http://api.rubyonrails.org/v5.0.0.1/classes/ActionController/Parameters.html


### System configuration

**Rails version**: 5.0.0.1
**Ruby version**: 2.3.3

