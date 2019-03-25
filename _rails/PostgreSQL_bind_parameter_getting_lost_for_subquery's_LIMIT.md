---
title: PostgreSQL bind parameter getting lost for subquery's LIMIT
labels: With reproduction steps, activerecord, attached PR
layout: issue
---

### Steps to reproduce

See the gist: https://gist.github.com/Envek/fbd1f8576148ec4be33308636339b314

Models:

``` ruby
class Post < ActiveRecord::Base
  has_many :comments
end

class Comment < ActiveRecord::Base
  belongs_to :post
end
```

and query:

``` ruby
last_comment_relation = Comment.where('"comments"."post_id" = "posts"."id"').order(created_at: :desc).limit(1)
posts = Post.all.eager_load(:comments).where(comments: { id: [nil, last_comment_relation.select(:id)] }).load
```
### Expected behavior

Query should run successfully and should return all posts with 0 or 1 latest comment for each with single query to DB
### Actual behavior

Exception

```
ERROR: bind message supplies 0 parameters, but prepared statement "" requires 1
```

While executing:

``` ruby
SELECT "posts"."id" AS t0_r0, "comments"."id" AS t1_r0, "comments"."post_id" AS t1_r1, "comments"."created_at" AS t1_r2, "comments"."updated_at" AS t1_r3 FROM "posts" LEFT OUTER JOIN "comments" ON "comments"."post_id" = "posts"."id" WHERE ("comments"."id" IN (SELECT  "comments"."id" FROM "comments" WHERE ("comments"."post_id" = "posts"."id") ORDER BY "comments"."created_at" DESC LIMIT $1) OR "comments"."id" IS NULL)
```

This error raises only when I add check for `NULL` as inclusion of `comments.id` in array of `nil` and subquery relation and only if that relation contains limit:

``` ruby
where(comments: { id: [nil, last_comment_relation.select(:id)] })
```

Neither #25786 or #25877 doesn't seem to fix this issue
### System configuration

**Rails version**: 5.0.0.1

**Ruby version**: 2.3.1

