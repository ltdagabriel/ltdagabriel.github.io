---
title: ActiveRecord Mysql2 incorrectly casting boolean values
labels: activerecord, attached PR
layout: issue
---

The Mysql2 adapter incorrectly casts boolean values. Instead of `1` or `0`, it casts to `t` or `f` respectively.

I noticed this with a model similar to this, using the mysql2 adapter:

```
class Model < ActiveRecord::Base
  validates_uniqueness_of :boolean_field
end

m = Model.first
m.valid?
```

Which then generates sql similar to this:

```
SELECT 1 AS one FROM `models` WHERE (`models`.`boolean_field` = BINARY 't' AND `models`.`id` != 1) LIMIT 1
```

the `'t'` should be `1` in this case

Gist with failing test:
https://gist.github.com/awilliams/5867330

