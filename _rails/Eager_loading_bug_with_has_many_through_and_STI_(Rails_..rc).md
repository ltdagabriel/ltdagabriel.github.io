---
title: Eager loading bug with has_many :through and STI (Rails 4.0.0rc2)
labels: activerecord, attached PR
layout: issue
---

When using eager loading on a `has_many :through` to a model using STI, the output SQL seems to be incorrect:

``` ruby
class Group < ActiveRecord::Base
  has_many :users
  has_many :articles, through: :users
end

class User < ActiveRecord::Base
  belongs_to :group
  has_many :articles
end

class Post < ActiveRecord::Base
  belongs_to :user
end

class Article < Post
end
```

Running

``` ruby
Group.includes(:articles).to_a
```

results in

```
ActiveRecord::StatementInvalid: SQLite3::SQLException: 
no such column: posts.type: SELECT "users".* FROM "users"  
WHERE "posts"."type" IN ('Article') AND "users"."group_id" 
IN (298486374, 980190962, 980190963)
```

Dummy app showing the problem with test:
https://github.com/balvig/bug/blob/master/test/models/group_test.rb

