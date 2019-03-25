---
title: Association's after_touch not called with counter cache
labels: activerecord
layout: issue
---

### Steps to reproduce

```ruby
gem "bundler"

begin
  require "bundler/inline"
rescue LoadError => e
  $stderr.puts "Bundler version 1.10 or later is required. Please update your Bundler"
  raise e
end

gemfile(true) do
  source "https://rubygems.org"

  git_source(:github) { |repo| "https://github.com/#{repo}.git" }

  gem "rails", github: "rails/rails"
  gem "sqlite3"
end

require "active_record"
require "minitest/autorun"
require "logger"

ActiveRecord::Base.establish_connection(adapter: "sqlite3", database: ":memory:")
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :posts do |t|
    t.integer :comments_count, default: 0
    t.integer :lock_version
    t.timestamps
  end

  create_table :comments do |t|
    t.belongs_to :post
  end

  create_table :likes do |t|
    t.belongs_to :post
  end
end

class Post < ActiveRecord::Base
  after_touch :touched

  def touched
    raise 'Post touched!'
  end
end

class Comment < ActiveRecord::Base
  belongs_to :post, touch: true, counter_cache: true
end

class Like < ActiveRecord::Base
  belongs_to :post, touch: true
end

class BugTest < Minitest::Test
  def test_with_counter_cache
    post = Post.create
    Comment.create(post: post) # after_touch not called.
  end

  def test_without_counter_cache
    post = Post.create
    Like.create(post: post) # after_touch called.
  end
end
```

### Expected behavior
`after_touch` calls while `Comment.create`.

### Actual behavior
`after_touch` not called while `Comment.create`.

### System configuration
**Rails version**: master@732aa34

**Ruby version**: 2.4.2

