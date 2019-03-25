---
title: Guides: when migrating from 3.0, change NAME::Application.config.session_store
labels: docs
layout: issue
---

In the guides for upgrading from Rails 3.0 to Rails 3.1, it would be helpful to document that the session_store key needs to be changed.

``` ruby
# config/initializers/session_store.rb
AppName::Application.config.session_store :cookie_store, :key => 'SOMETHINGNEW'
```

This migration step is also documented in this ticket https://github.com/rails/rails/issues/2509#issuecomment-1973813

