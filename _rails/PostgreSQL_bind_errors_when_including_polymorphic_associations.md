---
title: PostgreSQL bind errors when including polymorphic associations
labels: activerecord, regression, release blocker
layout: issue
---

Test Case: https://gist.github.com/dmarkow/c27d00bc4fb030f2dce5

With this setup:

``` ruby
class Post < ActiveRecord::Base
  has_many :comments
  has_many :notes, as: :notable
end

class Note < ActiveRecord::Base
  belongs_to :notable, polymorphic: true
end

class Comment < ActiveRecord::Base
  belongs_to :post
end
```

and a test case that does this:

``` ruby
Post.includes(:comments).order("comments.category").first
Post.includes(:notes).order("notes.category").first
```

the first (non-polymorphic) line works fine, but the second one raises this:

```
BugTest#test_association_stuff:
ActiveRecord::StatementInvalid: PG::ProtocolViolation: ERROR:  bind message supplies 0 parameters, but prepared statement "" requires 1
: SELECT  DISTINCT "posts"."id", notes.category AS alias_0 FROM "posts" LEFT OUTER JOIN "notes" ON "notes"."notable_id" = "posts"."id" AND "notes"."notable_type" = $1  ORDER BY notes.category LIMIT 1
```

This came up when trying out the 4.2.0 beta, and it happens on the master branch too. Works perfectly fine through 4.1.5.

I searched and the only recent issue that seems to be possibly related is #15821

