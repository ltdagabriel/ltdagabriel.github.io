---
title: `has_and_belongs_to_many` incorrect size calculation from build - applies to 3.2, 4.0, 4.1 and master
labels: activerecord
layout: issue
---

In all recent versions of ActiveRecord (3.2, 4.0, 4.1 and master), calculating a HABTM relation's size from build has always been incorrect, as demonstrated below.

``` ruby
source 'http://rubygems.org'

gem 'rails', github: 'rails/rails'
gem 'arel',  github: 'rails/arel'
gem 'sqlite3'
```

``` ruby
# uncomment for master
require 'bundler'
Bundler.setup(:default)

# uncomment for releases
# gem 'activerecord', '4.1.0'
# gem 'activerecord', '4.0.4'
# gem 'activerecord', '3.2.17'

require 'active_record'
require "minitest/autorun"
require 'minitest/pride'
require 'logger'

ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: ':memory:')
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :users, force: true do |t|
  end
  create_table :comments_users, force: true do |t|
    t.integer :comment_id
    t.integer :user_id
  end
  create_table :comments, force: true do |t|
  end
  create_table :posts, force: true do |t|
    t.integer :user_id
  end
end

class User < ActiveRecord::Base
  has_and_belongs_to_many :comments
  has_many :posts
end

class Comment < ActiveRecord::Base
  has_and_belongs_to_many :users
end

class Post < ActiveRecord::Base
  belongs_to :user
end

class BugTest < MiniTest::Unit::TestCase
  def setup
    @user = User.create!
    @user.comments.build
    @user.posts.build
  end

  def test_comments_size_failure
    assert_equal 1, @user.comments.size
  end

  def test_comments_size_success
    @user.comments.inspect
    assert_equal 1, @user.comments.size
  end

  def test_comments_length
    assert_equal 1, @user.comments.length
  end

  def test_posts_size
    assert_equal 1, @user.posts.size
  end

  def test_posts_length
    assert_equal 1, @user.posts.length
  end
end
```

P.S. A possibly related issue that only applies to 4.1 and master: #14913.

