---
title: Time attributes contain different values before and after reloading from DB
labels: With reproduction steps, activerecord
layout: issue
---

### Steps to reproduce
```ruby
# frozen_string_literal: true

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
    t.timestamps null: false
  end
end

class Post < ActiveRecord::Base
end

class BugTest < Minitest::Test
  def test_association_stuff
    post = Post.create!

    assert_equal post.created_at, post.reload.created_at
    assert_equal post.updated_at, post.reload.updated_at
  end
end

```

### Expected behavior
The `created_at` and `updated_at` times *should* be the same before and after reloading the record from the database. 

### Actual behavior
The `created_at` and `updated_at` times display different values before and after reloading. This can be seen when comparing the values for `post.created_at.nsec` and `post.reload.created_at.nsec`.

### System configuration
**Rails version**: 5.1.2

**Ruby version**: `ruby 2.2.2p95 (2015-04-13 revision 50295) [x86_64-linux-gnu]` on RHEL6.

**NOTE:** This spec passes when using `ruby 2.2.2p95 (2015-04-13 revision 50295) [x86_64-darwin15]` on macOS.

