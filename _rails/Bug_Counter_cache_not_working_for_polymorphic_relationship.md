---
title: Bug: Counter cache not working for polymorphic relationship
labels: activerecord, attached PR
layout: issue
---

When using counter_cache with Rails' polymorphic relationship, the `increment` part of the counter_cache does not work. Decrement, on the other hand, does work.

Example:

``` ruby
require 'active_record'
require 'minitest/autorun'
require 'sqlite3'
require 'logger'

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection 'sqlite3::memory:'

ActiveRecord::Schema.define do
  create_table(:upvotes) do |t|
    t.integer :upvotable_id
    t.string :upvotable_type
  end

  create_table(:comments) do |t|
    t.integer :upvotes_count, default: 0
  end
end

class Upvote < ActiveRecord::Base
  belongs_to :upvotable, counter_cache: true, polymorphic: true
end

class Comment < ActiveRecord::Base
  has_many :upvotes, as: :upvotable
end

class BugTest < Minitest::Test
  def test_counter_cache_increment
    upvote = Upvote.create!
    comment = Comment.create!

    assert_equal 0, comment.reload.upvotes_count.to_i
    comment.upvotes << upvote
    assert_equal 1, comment.reload.upvotes_count # fails here
  end

  def test_counter_cache_decrement
    comment = Comment.create!
    comment.upvotes << Upvote.create!

    comment.upvotes.first.destroy

    assert_equal 0, comment.reload.upvotes_count # fails here
  end
end
```

