---
title: Counter cache conflicts with touch:true by optimistic locking
labels: activerecord
layout: issue
---

### Steps to reproduce

```ruby
gem "bundler", "< 1.16"

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
end

class Post < ActiveRecord::Base
end

class Comment < ActiveRecord::Base
  belongs_to :post, touch: true, counter_cache: true
end

class BugTest < Minitest::Test
  def test_association_stuff
    post = Post.create!
    Comment.create!(post: post)
  end
end
```

### Expected behavior
Should generate a single SQL to update both updated_at and counter cache column.

### Actual behavior
There are 2 SQLs raise optimistic locking exception.

Output:
```
Post Update All (0.1ms)  UPDATE "posts" SET "comments_count" = COALESCE("comments_count", 0) + 1, "lock_version" = COALESCE("lock_version", 0) + 1 WHERE "posts"."id" = ?  [["id", 1]]
Post Update All (0.1ms)  UPDATE "posts" SET "updated_at" = '2017-11-22 15:29:31.744519', "lock_version" = 1 WHERE "posts"."id" = ? AND "posts"."lock_version" = ?  [["id", 1], ["lock_version", 0]]
(0.1ms)  rollback transaction

ActiveRecord::StaleObjectError: Attempted to touch a stale object: Post.
```

### System configuration
**Rails version**: 5.1.4 or master@858baa0

**Ruby version**: 2.4.2

