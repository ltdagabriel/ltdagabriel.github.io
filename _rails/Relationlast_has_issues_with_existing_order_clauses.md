---
title: Relation#last has issues with existing order_clauses
labels: activerecord, regression
layout: issue
---

On rc1, if a model has a default_scope with an order clause, #last does not generate the correct sql query, resulting in the same object as #first being returned.

For example, lets say I have a User model with a default_scope with created_at ASC:

``` ruby
class User < ActiveRecord::Base
  def self.default_scope
     order('created_at ASC')
  end
end
```

Then User.last generates this sql:

```
SELECT "users".* FROM "users" ORDER BY created_at ASC, created_at DESC LIMIT 1
```

So:

```
>> User.first == User.last
  User Load (3.1ms)  SELECT "users".* FROM "users" ORDER BY created_at ASC LIMIT 1
  User Load (1.1ms)  SELECT "users".* FROM "users" ORDER BY created_at ASC, created_at DESC LIMIT 1
=> true
```

It looks like it only happens with order clauses in the default_scope. (also effects #last in a relationship call e.g. `project.users.last`)

