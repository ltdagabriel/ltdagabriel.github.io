---
title: ActiveSupport::Duration == is misleading (OR parts don't combine correctly)
labels: activesupport
layout: issue
---

Example:

``` irb
irb(main):001:0> a = 1.month
=> 1 month
irb(main):002:0> a = 2.months
=> 2 months
irb(main):003:0> b = 1.month + 1.month
=> 2 months
irb(main):004:0> a==b
=> true
irb(main):005:0> Date.new(2012,1,31) + a
=> Sat, 31 Mar 2012
irb(main):006:0> Date.new(2012,1,31) + b
=> Thu, 29 Mar 2012
```

Details:
The equality code only compares the "value", but as shown here, "parts" is different

``` irb
irb(main):007:0> a.value
=> 5184000
irb(main):008:0> a.parts
=> [[:months, 2]]
irb(main):009:0> b.value
=> 5184000
irb(main):010:0> b.parts
=> [[:months, 1], [:months, 1]]
irb(main):011:0>
```

Solution:
If this is considered a problem, the solution is either to make equality use parts in some way (thus changing the == behavior), or implement some sort of compression, where multiple identical parts are automatically combined (thus changing the + behavior)

