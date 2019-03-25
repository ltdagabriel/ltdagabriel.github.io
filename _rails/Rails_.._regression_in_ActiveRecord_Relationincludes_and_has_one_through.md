---
title: Rails 3.2.13 regression in ActiveRecord::Relation#includes and has_one :through
labels: activerecord, regression
layout: issue
---

After upgrading to 3.2.13 my test suite started to fail in tests that check how many queries are issued for certain actions.

I have the following setup (simplified from my proprietary app):

``` ruby
class A < ActiveRecord::Base
  belongs_to :m_b, inverse_of: :a, class_name: 'M::B', foreign_key: :m_b_id
  has_one :c, :through => :m_b
end

class M::B < ActiveRecord::Base
  belongs_to :m_d, class_name: 'M::D'
  has_one :c, :as => :thing
end
```

This is the test query code to expose the regression:

``` ruby
A.includes(:m_b => :m_d).includes(:c).limit(10).map { |a| a.m_b.m_d.to_s }
```

On 3.2.12 this gives me 4 queries (one for each model as you would expect). On 3.2.13 m_d is not eager loaded and for each iteration of a I get queries:

```
  M::B Load (0.3ms)  SELECT "m_b".* FROM "m_b" WHERE "m_b"."id" = 20 LIMIT 1
  M::D Load (0.3ms)  SELECT "m_d".* FROM "m_d" WHERE "m_d"."id" = 11 LIMIT 1
```

