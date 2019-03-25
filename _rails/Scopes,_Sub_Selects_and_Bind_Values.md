---
title: Scopes, Sub Selects and Bind Values
labels: PostgreSQL, activerecord
layout: issue
---

This issue is tested using Rails 4.0.1. Running against Postgres 9.3 with the latest pg gem.

I've only realised recently that AR will change Relations into Sub Selects and have been trying to use them to simplify my queries and scopes.

I've started to run into a couple of issues, particularly with binds and sub selects. An example of one such problem below:

``` ruby
class Article < AR::Base
  has_many :comments
end

class Comment < AR::Base
  belongs_to
  has_many :replies, class_name: "Comment", foreign_key: :parent_id

  def self.leaves
    where.not(id: all.select(:parent_id))
  end
end

article = Article.first
Comment.leaves.count # => Works as expected
article.comments.leaves.count # => Fails with an error due to binds as below

  PG::ProtocolViolation: ERROR:  bind message supplies 2 parameters, but prepared statement "a29" requires 1
SELECT "comments".* FROM "comments"  WHERE "comments"."article_id" = $1 AND ("comments"."id" NOT IN (SELECT parent_id FROM "comments"  WHERE "comments"."article_id" = $1))
```

I've also got some much more complex examples which have the opposite problem. In those I'm trying to OR together some large and complex scopes. I read that this was possible using `#where_values` on a relation. However whenever I try and use that I run into errors because the Arel nodes contain prepared $1 values (and the like) that don't get populated when I do anything with them manually.

I suspect it could come down to a common problem? I might be misusing something or stretching the ORM too far. I suspect both could be solved if I could "force" the substitution of the value into the query selectively. That or manually supply the binds to the query. I've dug about as far as I can get though.

Any ideas?

I can provide a more fleshed out example of the larger problem I alluded to. It just needs more models and a bit of time to boil down.

Thanks for the great work guys!

