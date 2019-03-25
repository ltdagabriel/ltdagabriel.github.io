---
title: Issue running AutomaticCollectionCacheTest tests in a specific order
labels: actionpack, actionview
layout: issue
---

It appeared in [this build](https://travis-ci.org/rails/rails/jobs/66489622) for the commit 0965be14e22c4d1fd6befda4fd3efb942e0701ca using `--seed 49713`. Even with that seed, it does not always happen.

So far, it seems that [AutomaticCollectionCacheTest#test_explicit_render_call_with_options](https://github.com/rails/rails/blob/8beb328befa53d74fe9c7942ddb188563bd4de33/actionpack/test/controller/caching_test.rb#L400) is being called before [AutomaticCollectionCacheTest#test_caching_works_with_beginning_comment](https://github.com/rails/rails/blob/8beb328befa53d74fe9c7942ddb188563bd4de33/actionpack/test/controller/caching_test.rb#L406) and is adding the partial `customers/customer` to the cache. That prevents the action `index_with_comment` to actually render `customers/commented_customer` and provides it the cached output, since both partials do generate the same output and have the same `collection`.

I thought that ActiveSupport::Cache::MemoryStore was having issues keeping it thread-safe, but I believe is working as designed if you consider that the tests are running from the same process and thread.

@rafaelfranca any thought on this?

