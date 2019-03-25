---
title: Model.unscoped block not removing default scope for joins
labels: With reproduction steps, activerecord, attached PR
layout: issue
---

Summary:

Suppose Model has a default scope.

``` ruby
Model.unscoped { Foo.joins(:model) }
```

acts as if `Model.unscoped { ... }` were not specified. That is, it constructs `Foo.joins(:model)` as if it weren't inside `Model.unscoped`, so that `Model.default_scope` is mistakenly continuing to apply to the `joins`, even though `unscoped` should have removed it.

---

Consider a `User` with a `default_scope` that specifies `status = 1`:

``` ruby
>> User.all.to_sql
#=> "SELECT `users`.* FROM `users`  WHERE `users`.`status` = 1"
```

If an `Item` belongs to `User`, trying to join the two with `Item.joins(:user)` seems to always respect `User.default_scope`, no matter how you try to remove the default scope. So the `joins` SQL

``` ruby
>> Item.joins(:user).to_sql # includes User.default_scope, CORRECTLY.
#=> "SELECT `items`.* FROM `items` INNER JOIN `users` ON `users`.`id` = `items`.`user_id` AND `users`.`status` = 1
```

correctly includes

```
`users`.`status` = 1
```

as it should, but if you try to remove it with `User.unscoped { ... }`, the `status = 1` default scope on `User` is still applying, which I believe is a bug:

``` ruby
User.unscoped do
  Item.joins(:user) # User is incorrectly still scoped to status == 1 here
end
```

As a total aside, it would be nice to have something like `joins_unscoped(:user)` as an alternative.

