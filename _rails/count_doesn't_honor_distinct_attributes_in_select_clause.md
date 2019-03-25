---
title: #count doesn't honor distinct attributes in select clause
labels: activerecord, attached PR
layout: issue
---

Calling `count` on an ActiveRecord::Relation with more than 1 distinct attribute in the select clause doesn't honor the select conditions.  For example, this works:

``` ruby
User.select('distinct username').all    #=> SELECT distinct username FROM "users"
User.select('distinct username').count  #=> SELECT COUNT(distinct username) FROM "users"
```

However, the distinct clause disappears from the count SQL when another distinct attribute is specified:

``` ruby
User.select('distinct username, email').all     #=> SELECT distinct username, email FROM "users"
User.select('distinct username, email').count   #=> SELECT count(*) FROM "users"
```

Same thing with `distinct users.*`:

``` ruby
User.select('distinct users.*').all     #=> SELECT distinct users.* FROM "users"
User.select('distinct users.*').count   #=> SELECT count(*) FROM "users"
```

That means for a relation with multiple distinct columns, `relation.count` is not necessarily the same as `relation.all.count`.

For `distinct users.*`, `count(:distinct => true)` works (it generates `SELECT COUNT(DISTINCT "users"."id") FROM "users"`), but that won't work for `distinct username, email`.

I've verified this behavior on Postgres and SQLite.

