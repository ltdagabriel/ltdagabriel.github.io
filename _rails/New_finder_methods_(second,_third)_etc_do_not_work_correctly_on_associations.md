---
title: New finder methods (#second, #third) etc do not work correctly on associations
labels: activerecord
layout: issue
---

## Background

This issue was documented by @carlosantoniodasilva inside of PR #13757 (which addresses issue #13743) after it was merged. I am adding it here for tracking purposes in case I get hit by a bus and it never gets fixed.
## The Issue

Observed behavior after #13757 was merged (which is two separate bugs)
#### Bug 1 New finder methods don't work on reloaded associations and raise an exception

``` ruby
# consider the models `Author` has many `Post`s
>> carlos.posts.reload.first
  Post Load (0.1ms)  SELECT "posts".* FROM "posts"  WHERE "posts"."author_id" = ?  [["author_id", 1]]
=> #<Post id: 1, author_id: 1, title: "ZOMG", body: nil, created_at: "2014-01-21 11:44:22", updated_at: "2014-01-21 11:44:22">
>> carlos.posts.reload.second
  Post Load (0.1ms)  SELECT "posts".* FROM "posts"  WHERE "posts"."author_id" = ?  [["author_id", 1]]
NoMethodError: undefined method 'first' for nil:NilClass
  from....rails/rails/activerecord/lib/active_record/relation/finder_methods.rb:449:in 'find_nth'
```
#### Bug 2 New finder methods return the wrong records on associations

``` ruby
>> carlos.posts.first
=> #<Post id: 1, author_id: 1, title: "ZOMG", body: nil, created_at: "2014-01-21 11:44:22", updated_at: "2014-01-21 11:44:22">
>> carlos.posts.second
=> #<Post id: 1, author_id: 1, title: "ZOMG", body: nil, created_at: "2014-01-21 11:44:22", updated_at: "2014-01-21 11:44:22">
>> carlos.posts.third
=> #<Post id: 1, author_id: 1, title: "ZOMG", body: nil, created_at: "2014-01-21 11:44:22", updated_at: "2014-01-21 11:44:22">
```
## Gameplan

I will submit a new PR shortly and add some tests to ensure we don't regress on loaded/reloaded associations for these new methods.

