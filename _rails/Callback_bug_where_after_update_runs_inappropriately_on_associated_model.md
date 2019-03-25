---
title: Callback bug where `after_update` runs inappropriately on associated model
labels: activerecord, attached PR
layout: issue
---

I think I've hit a pretty obscure callback related issue.

After creating a record that references an associated model in its `after_create` callback, the associated model's `after_update` callback can be run, even if that model was not updated.

``` ruby
gem 'activerecord', '4.0.2'
require 'active_record'

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: ':memory:')

ActiveRecord::Schema.define do
  create_table :users do |t|
  end

  create_table :posts do |t|
    t.integer :user_id
  end

  create_table :comments do |t|
    t.integer :post_id
  end
end

class User < ActiveRecord::Base
  has_many :posts

  after_update :this_should_not_run

  def this_should_not_run
    puts "But it does, even though the user wasn't updated"
  end
end

class Post < ActiveRecord::Base
  belongs_to :user
  has_many :comments
end

class Comment < ActiveRecord::Base
  after_create :reference_user

  has_one :user, through: :post
  belongs_to :post

  def reference_user
    puts "If I load my user its after_update callback runs! #{self.user.id}"
  end
end

user = User.create
post = user.posts.create
comment = post.comments.build
comment.save
```

Running the above script will output the strings from both callbacks. The user isn't being touched or modified, just referenced from the comment's callback. If you remove the `self.user.id` call from the comment's callback, the user's callback doesn't run.

The `has_one through` association is required to reproduce the bug. Moving the `after_update` callback to the post model, and referencing the post from the comment's `after_create` doesn't trigger the bug.

My current workaround is to define the `after_create` callback _after_ the comment model's associations. This somehow avoids the `after_update` callback being triggered inappropriately.

I initially hit this bug on 3.2.16, but it looks like it's still present on 4.0.2.

Not sure where to dig in and get started on this, it's pretty obscure. Does anyone have any thoughts?

