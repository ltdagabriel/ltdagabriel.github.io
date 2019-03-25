---
title: ActionView::TestCase, helper that uses asset_path
labels: actionview, stale
layout: issue
---

I have an ordinary helper module that has a method, where part of it's implementation calls the #asset_path helper. This works fine. 

I have an ActionView::TestCase that tests/calls this helper. This generally works fine, unless it tries to call the helper method that calls asset_path. 

I get a:

```
undefined method `asset_path' for #<BentoSearchHelperTest:0x0000000f9aefc0>
.../actionpack-3.2.8/lib/action_dispatch/testing/assertions/routing.rb:176:in `method_missing'
..../actionpack-3.2.8/lib/action_view/test_case.rb:236:in `method_missing'
```

As you can see I'm using rails 3.2.8. 

I believe this is a bug. But correct me if I'm wrong and I'm doing something wrong or something. 

