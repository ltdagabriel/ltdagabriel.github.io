---
title: AR containing an attribute of it's pluralized name cause typecasting exceptions.
labels: activerecord, attached PR, needs work
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
  create_table :users, force: true do |t|
  end

  create_table :hours, force: true do |t|
    t.integer  "user_id"
    t.float :hours
  end
end

class User < ActiveRecord::Base
  has_many :hours
end

class Hour < ActiveRecord::Base
  belongs_to :user
end

class BugTest < Minitest::Test
  # This passes on Rails 5.0.x, fails on 5.1.x
  def test_collection_with_plural_of_class_name_as_attribute_fails_typecasting
    user = User.create!
    hour = user.hours.build
    assert hour.save
  end
end
```
### Expected behavior
A new hour object is built, and saved with only the attribute user_id assigned.

### Actual behavior
An error in typecasting attempted to convert the hash `{"user_id"=>1}` to a float.

### System configuration
Using activerecord 5.1.0
ruby 2.4.1p111 (2017-03-22 revision 58053) [x86_64-darwin16]

