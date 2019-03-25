---
title: Rails 5.1 regression - unscope broken with a specific where value
labels: With reproduction steps, activerecord, attached PR, regression
layout: issue
---

### Steps to reproduce

Added this spec to `test/cases/relations_test.rb`

``` ruby
def test_unscope_specific_where_value
  posts = Post.where(title: "Welcome to the weblog", body: "Such a lovely day")

  assert_equal 1, posts.count
  assert_equal 1, posts.unscope(where: :title).count
  assert_equal 1, posts.unscope(where: :body).count
end
```

Which fails on the final assertion with:

```
RelationTest#test_unscope_specific_where_value [test/cases/relations_test.rb:1978]:
Expected: 1
  Actual: 0
```

Unscoping the last argument should allow it to return the same record. We're only removing a condition so it shouldn't return _fewer_ record. AR is constructing the query incorrectly and returning no records.

### What's going on?

When unscoping the individual attribute it isn't treating binds correctly.

``` ruby
posts.to_sql
# SELECT "posts".* FROM "posts" WHERE "posts"."title" = 'Welcome to the weblog'
#                                 AND "posts"."body" = 'Such a lovely day'

posts.unscope(where: :title).to_sql
# SELECT "posts".* FROM "posts" WHERE "posts"."body" = 'Such a lovely day'

posts.unscope(where: :body).to_sql
# SELECT "posts".* FROM "posts" WHERE "posts"."title" = 'Such a lovely day'
```

So the bind intended for the `title` is now being used on the `body`. Whoops!

### Expected behavior

Binds stay attached to the correct attribute.

### Actual behavior

Binds become messed up. And the resulting query is incorrect.

### System configuration
**Rails version**:
5.1.0.rc1

**Ruby version**:
2.3.3
