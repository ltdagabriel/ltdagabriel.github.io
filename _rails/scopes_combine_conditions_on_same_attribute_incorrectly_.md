---
title: scopes combine conditions on same attribute incorrectly 
labels: activerecord
layout: issue
---

This issue exists since 3.0 (a backport would be nice if it gets fixed)

``` Ruby
class Car < ActiveRecord::Base
  scope :good, where(:id => 1)
  scope :bad, where(:id => 2)
end

# using scopes
Car.good.bad
SELECT "cars".* FROM "cars" WHERE "cars"."id" = 2

# using wheres
Car.where(:id => 1).where(:id => 2)
SELECT "cars".* FROM "cars" WHERE "cars"."id" = 1 AND "cars"."id" = 2
```

Does the same for different attributes, especially annoying when you do logic like `id => [1,2,3] + id => [2,3,4]` and expect only 2 to get returned

