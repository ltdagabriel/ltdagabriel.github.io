---
title: Scope raises error when array is passed as argument
labels: activerecord
layout: issue
---

### Steps to reproduce

``` ruby
begin
  require 'bundler/inline'
rescue LoadError => e
  $stderr.puts 'Bundler version 1.10 or later is required. Please update your Bundler'
  raise e
end

gemfile(true) do
  source 'https://rubygems.org'
  gem 'activerecord', '5.0.0'
  gem 'sqlite3'
end

require 'active_record'
require 'minitest/autorun'
require 'logger'

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: ':memory:')
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

  scope :by_post_ids, -> (post_ids = []) { where(post_id: post_ids) }
end

class BugTest < Minitest::Test
  def test_array_as_argument_to_scope
    Comment.by_post_ids([1, 2, 3])
  end
end
```
### Expected behavior

It returns comments for `post_ids` passed as argument
### Actual behavior

Raise 

```
ArgumentError: wrong number of arguments (3 for 0..1)
```
### System configuration

**Rails version**: 5.0.0

**Ruby version**: 2.2.4

