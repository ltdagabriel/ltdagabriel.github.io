---
title: Hash#deep_merge inline docs don't demonstrate behavior well
labels: docs
layout: issue
---

The inline documentation for [`deep_merge`](https://github.com/rails/rails/blob/master/activesupport/lib/active_support/core_ext/hash/deep_merge.rb) contains the following:

``` ruby
h1 = {:x => {:y => [4,5,6]}, :z => [7,8,9]}
h2 = {:x => {:y => [7,8,9]}, :z => "xyz"}

h1.deep_merge(h2) #=> { :x => {:y => [7, 8, 9]}, :z => "xyz" }
h2.deep_merge(h1) #=> { :x => {:y => [4, 5, 6]}, :z => [7, 8, 9] }
```

These are correct, but the behavior is the same with a vanilla `merge`:

``` ruby
h1.merge(h2)      #=> { :x=> { :y => [7, 8, 9] }, :z => "xyz" }
h2.merge(h1)      #=> { :x => { :y => [4, 5, 6] }, :z => [7, 8, 9] }
```

