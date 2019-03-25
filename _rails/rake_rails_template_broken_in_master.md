---
title: rake rails:template broken in master
labels: railties
layout: issue
---

```
% rake rails:template LOCATION=foo
rake aborted!
protected method `apply' called for #<Rails::Generators::AppGenerator:0x007fe67e0c45b0>
```

I think 8beb42cfbc41753ae4dbb91e16abcd1fb7d00356 may be the culprit, where an `apply` method was added with protected visibility by @tenderlove. Simply making the method public doesn't seem to fix the issue though.

I can dig deeper if needed, but I figured it might be an easy fix for someone more familiar with the interaction between the generator and thor.

