---
title: Changing reference_id doesn't change reference
labels: With reproduction steps, activerecord
layout: issue
---

Here are the basic information:

``` ruby
class User < ActiveRecord::Base
  has_many :posts
end

class Post < ActiveRecord::Base
  belongs_to :user
end

user1 = User.create!(:name => "User1")
user2 = User.create!(:name => "User2")
Post.create(:content => "Post", :user_id => user1.id) # assume new post id is "1"
```

The first way to change the associated user for post

``` ruby
post = Post.find(1)
post.user_id == user1.id # true
post.user.id == user1.id #true

post.user_id = user2.id
post.user_id == user2.id # true
post.user.id == user2.id # true
```

The second way to change the associated user for the post

``` ruby
post = user1.posts.find(1)
post.user_id == user1.id # true
post.user.id == user1.id #true

post.user_id = user2.id
post.user_id == user2.id # true
post.user.id == user2.id # false , why? Is this a intention?
```

