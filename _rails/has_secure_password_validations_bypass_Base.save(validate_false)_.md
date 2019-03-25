---
title: has_secure_password validations bypass Base.save(validate: false) 
labels: activemodel
layout: issue
---

Hey,

In the process of upgrading an app to Rails 4 (from 3.2.15), some tests using `ActiveRecord.save(validate: false)` failed because apparently `has_secure_password`'s validations bypass that option. 

This has been introduced in this commit I believe ad7f9cdf008e1261fdcdc8e8152462f69b48c20d 

I accept that there are use cases where you want your own validations for `has_secure_password`, but the validations API documentation specifically says that passing `validate: false` will bypass all your validations. Given the semantics of `has_secure_password`, namely that it gets included on the fly, it's reasonable to assume that its validations will be treated equally. 

I see two solutions to this and I can take care of both if there are no objections: 
1. Update the documentation to exclude `has_secure_password` from the list of bypassed validations when calling `validate: false` (Brittle)
2. Make `has_secure_password` pick up `validate: false` while keeping its own options if people rely on it.

