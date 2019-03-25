---
title: #persisted? return true if object saved in nested transaction(with requires_new) and rollback in parent transaction.
labels: activerecord
layout: issue
---

### Steps to reproduce

Although there is nested transaction, but nested transaction have not been noticed it rollback by `RealTransaction`.

```
begin
  require "bundler/inline"
rescue LoadError => e
  $stderr.puts "Bundler version 1.10 or later is required. Please update your Bundler"
  raise e
end

gemfile(true) do
  source "https://rubygems.org"
  gem "rails", github: "rails/rails"
  gem "arel", github: "rails/arel"
  gem "sqlite3"
end

require "active_record"
require "minitest/autorun"
require "logger"

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: "sqlite3", database: ":memory:")
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :posts, force: true do |t|
  end

  create_table :comments, force: true do |t|
    t.integer :post_id
  end
end

class Post < ActiveRecord::Base
  has_many :comments
end

class Comment < ActiveRecord::Base
  belongs_to :post
end

class BugTest < Minitest::Test
  def test_persisted_in_nested_transaction_with_requires_new
    post_one = Post.new
    post_two = Post.new

    Post.transaction do
      post_one.save
      
      Post.transaction(requires_new: true) do
        post_two.save
      end

      assert_equal true, post_one.persisted?
      assert_equal true, post_two.persisted?

      raise ActiveRecord::Rollback
    end

    assert_equal 0, Post.count
    assert_equal false, post_one.persisted?
    assert_equal false, post_two.persisted?
  end
end
```

### Expected behavior
rollback transaction, so `post_two.persisted?` should be return `false`.

### Actual behavior
```
  1) Failure:
BugTest#test_persisted_in_nested_transaction_with_requires_new [test.rb:60]:
Expected: false
  Actual: true
```

### System configuration
**Rails version**:
Rails 5.1.1

**Ruby version**:
ruby 2.3.4p301
