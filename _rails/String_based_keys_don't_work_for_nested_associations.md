---
title: String based keys don't work for nested associations
labels: activerecord, needs feedback
layout: issue
---

I'm sending associations to a job which turns all symbols to keys.  The association isn't recognized if it's a string instead of a symbol.  Gist to reproduce is below:

```
# Activate the gem you are reporting the issue against.
gem 'activerecord', '4.1.1'
require 'active_record'
require 'minitest/autorun'
require 'logger'

# Ensure backward compatibility with Minitest 4
Minitest::Test = MiniTest::Unit::TestCase unless defined?(Minitest::Test)

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: ':memory:')
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :posts do |t|
  end

  create_table :comments do |t|
    t.integer :post_id
  end

  create_table :labels do |t|
    t.integer :post_id
  end

  create_table :tags do |t|
    t.integer :comment_id
  end
end

class Post < ActiveRecord::Base
  has_many :comments
  has_many :labels
end

class Comment < ActiveRecord::Base
  belongs_to :post
  has_many :tags
end

class Label < ActiveRecord::Base
  belongs_to :post
end

class Tag < ActiveRecord::Base
  belongs_to :comment
end

class BugTest < Minitest::Test
  def test_association_stuff
    post = Post.create!
    comment = Comment.create!
    post.comments << comment
    post.labels << Label.create!
    comment.tags << Tag.create!

    assert_equal 1, Post.includes(:labels, comments: :tags).first.comments.first.tags.length
    #ActiveRecord::ConfigurationError: Association named 'comments' was not found on Post; perhaps you misspelled it?
    assert_equal 1, Post.includes(['labels', 'comments'=>'tags']).first.comments.first.tags.length
  end
end
```

