---
title: Dependent option in associations
labels: activerecord
layout: issue
---

Some time ago at #railsclub I had a talk with @fxn about behavior of dependent option in AR. 
I showed him an example:

``` ruby
class Post < ActiveRecord::Base
  has_many :comments, dependent: :destroy
end

class Comment < ActiveRecord::Base
  belongs_to :post

  before_destroy :before_destroy_callback

  def before_destroy_callback
    raise "before_destroy_callback"
  end
end

1.9.3-p125 :033 > Post.first.comments.delete_all
Post Load (0.1ms)  SELECT "posts".* FROM "posts" ORDER BY "posts"."id" ASC LIMIT 1
Comment Load (0.2ms)  SELECT "comments".* FROM "comments" WHERE "comments"."post_id" = ?  [["post_id", 1]]
(0.1ms)  begin transaction
(0.0ms)  rollback transaction
RuntimeError: before_destroy_callback
```

So in this example we see that callback for destroy is invoked but I call delete_all method.
I couldn't find this behavior in api docs, I saw just another one implementation of delete_all for AR::Relation but in the end I found it straight in the code https://github.com/rails/rails/blob/master/activerecord/lib/active_record/associations/collection_proxy.rb#L417 a bit later.

So it looks like intended behavior, but I know what I want, I want to destroy records for usual cases and I just want to delete all records for special cases (in console, etc) without instantiation and callbacks invocation, but for now I cannot do it directly.

In our talk with @fxn we decided to ask @jonleighton about it in this issue, but we didn't find this documentation, so may be it's ok but I'm confused.

