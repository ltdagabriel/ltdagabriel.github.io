---
title: ActiveRecord first() and last() behave differently with limit()
labels: activerecord, attached PR
layout: issue
---

### Steps to reproduce

``` ruby
5.times do
  Topic.create!
end

Topic.limit(1).first(2)
  Topic Load (0.8ms)  SELECT  "topics".* FROM "topics" ORDER BY "topics"."id" ASC LIMIT $1  [["LIMIT", 2]]
=> [#<Topic id: 1>, #<Topic id: 2>]

Topic.limit(1).last(2)
  Topic Load (0.3ms)  SELECT  "topics".* FROM "topics" LIMIT $1  [["LIMIT", 1]]
=> [#<Topic id: 5>]
```
### Expected behavior

I would expect that, for any ActiveRecord relation, `first(n).size` and `last(n).size` would always be equal.
### Actual behavior

The `first(n)` method seems to "overwrite" the `limit(1)`, whereas the `last(n)` method respects it. As a result, `Topic.limit(1).first(2).size` is 2 and `Topic.limit(1).last(2).size` is 1.

In my opinion the behavior of the `last(n)` method is correct. This is consistent with DHH's comments here, for instance: https://github.com/rails/rails/pull/23598#issuecomment-189675440.

This would seem to suggest that the `first(n)` method should ought to return an array of size 1 in the case of `Topic.limit(1).first(2)`.
### System configuration

**Rails version**: current `master` (https://github.com/rails/rails/commit/75097933e26e5147f666f485d41b38967c76311c)

**Ruby version**: 2.3.0

