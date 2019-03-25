---
title: ActiveRecord::QueryMethods#select! may be misleading
labels: activerecord, attached PR
layout: issue
---

When we call `select!` on a object which is a `ActiveRecord::Relation` instance, while we thought is was an `Array` instance, nothing raises but **the given block is ignored**.

For instance, if `User` is an `ActiveRecord` model, the given block in the code below is ignored:

``` ruby
users = User.all
# Block is ignored
users.select!{|u| false}
```

I think it's misleading, especially since :
- `#all` used to return an `Array` and it now returns an `ActiveRecord::Relation`
- `#select` doesn't have this problem, so it promotes the idea that you don't have to care when you use `select`. However you _do_ have to care when you use `select!` which contradict _Principle of Least Surprise_.

I think `ActiveRecord::Relation#select!` should raise `ArgumentError` when a block is given so, at least, developer knows he has to care.

Note: I don't make a pull request, because I'm still a Rails newbie, but I can make one, if my proposition is supported.

