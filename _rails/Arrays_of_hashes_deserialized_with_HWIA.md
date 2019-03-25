---
title: Arrays of hashes deserialized with HWIA
labels: With reproduction steps, activerecord, attached PR, regression
layout: issue
---

### Steps to reproduce

```ruby
begin
  require "bundler/inline"
rescue LoadError => e
  $stderr.puts "Bundler version 1.10 or later is required. Please update your Bundler"
  raise e
end

gemfile(true) do
  source "https://rubygems.org"
  # Activate the gem you are reporting the issue against.
  gem "activerecord", "5.1.0"
  gem "sqlite3"
end

require "active_record"
require "minitest/autorun"
require "logger"

# Ensure backward compatibility with Minitest 4
Minitest::Test = MiniTest::Unit::TestCase unless defined?(Minitest::Test)

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: "sqlite3", database: ":memory:")
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :posts, force: true do |t|
    t.text :content
  end
end

class Post < ActiveRecord::Base
  serialize :content, Array
end

class BugTest < Minitest::Test
  # This passes on Rails 5.0.x, fails on 5.1.x
  # The hashes in this array are Hash in 5.0, HashWithIndifferentAccess in 5.1
  def test_hashes_in_array
    post = Post.create!(content: [{ foo: 'bar' }])
    puts post.content.first.class
    assert_equal Hash, post.content.first.class
  end
end
```

### Expected behavior
Serialized hashes in arrays should deserialize as hashes

### Actual behavior
They're now HashWithIndifferentAccess

This might be intended (or not), whatever, but I even if it is I don't see any noted API change in the changelog. Does anyone know where and when did this change occurred?

### System configuration
**Rails version**: 5.1.0

**Ruby version**: 2.4.1

