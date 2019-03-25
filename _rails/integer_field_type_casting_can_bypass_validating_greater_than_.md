---
title: integer field type casting can bypass validating greater_than 0
labels: activemodel, stale
layout: issue
---

If foo is an **integer** and:

``` ruby
class BadValidation < ActiveRecord::Base
    validates :foo, :numericality => {:greater_than => 0}
end
```

Then 1.9 results in 1 which is weirdish, but understandable and maybe a fair price for not validating only_integer.  Worse however, .9 results in a 0 value which is accepted and saved--even though the saved record will subsequently test as invalid.

It seems that the greater_than test is performed before type casting.  Being able to thus accidentally bypass validation definitely seems like a bug.

