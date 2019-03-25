---
title: using dependent as destroy, destroy do not fails if associated objects fails the destroy
labels: activerecord, stale
layout: issue
---

Example:

``` ruby
class Category < ActiveRecord::Base
  has_many :posts, :dependent => :destroy
end
```

``` ruby
class Post < ActiveRecord::Base
  belongs_to :category

  # simulates a failure but using a callback
  # will produce the same issue
  def destroy
    false
  end
end
```

``` ruby
Category.create!(:name => "Category A")
Post.create!(:category => Category.first, :title => "Post A")

Category.first.destroy
#=> #<Category id: 1, name: "Category A", created_at: "2012-02-23 22:44:35", updated_at: "2012-02-23 22:44:35">

Category.first
#=> nil

Post.first
#=> #<Post id: 1, category_id: 1, title: "Post A", created_at: "2012-02-23 22:44:49", updated_at: "2012-02-23 22:44:49">
```

My real scenario is a bit more complex due to foreign keys, dependent restrict and others models before the model that fails the destroy due to a complex restriction.

Anyway, that code reproduce the issue :)

