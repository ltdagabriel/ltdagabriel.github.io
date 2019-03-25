---
title: Reference to request.flash left in request.rb
labels: actionpack, attached PR
layout: issue
---

### Steps to reproduce

Call reset_session on api only project.

https://github.com/rails/rails/blob/master/actionpack/lib/action_dispatch/http/request.rb#L340

https://github.com/rails/rails/commit/add46482a540b33184f3011c5c307f4b8e90c9cc#diff-3179d24efacadd64068c4d9c1184eac3
### Expected behavior

Should reset session
### Actual behavior

Throws exception NoMethodError (undefined method `flash=' for #ActionDispatch::Request:0x0056141a714b78):
### System configuration

**Rails version**: 5.0.0.beta3

**Ruby version**: 2.3.0

