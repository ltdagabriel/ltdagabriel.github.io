---
title: PG::ProtocolViolation: ERROR:  bind message supplies 2 parameters, but prepared statement requires 1
labels: PostgreSQL, activerecord
layout: issue
---

This issue has come up before (#10995) and has reportedly been fixed. However, I beleive that in certain circumstances this is still (as of rails 4.1.1 and 4.1.2.rc3) an open issue. 

Let me demonstrate. With the following code:

``` ruby

class Post < ActiveRecord::Base
  has_many :comments
end

class Comment < ActiveRecord::Base
  belongs_to :user
end

class User < ActiveRecord::Base
  has_and_belongs_to_many :followers, class_name: "User", join_table: "user_relationships",
    foreign_key: "following_user_id", association_foreign_key: "follower_id"
end

```

You get this in `rails c`:

```
> p = Post.create!
> u = User.create!
> p.comments.where(user: u.followers)
  Comment Load (0.4ms)  SELECT "comments".* FROM "comments"  WHERE "comments"."post_id" = $1 AND "comments"."user_id" IN (SELECT "users"."id" FROM "users" INNER JOIN "user_relationships" ON "users"."id" = "user_relationships"."follower_id" WHERE "user_relationships"."following_user_id" = $1)  [["post_id", 2], ["following_user_id", 2]]
  PG::ProtocolViolation: ERROR:  bind message supplies 2 parameters, but prepared statement "a1" requires 1

```

Try it yourself https://github.com/artemave/ar-bug

My uneducated guess is that habtm to self somehow messes things up.

