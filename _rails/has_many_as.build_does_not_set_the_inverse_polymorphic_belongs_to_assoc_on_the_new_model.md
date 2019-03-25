---
title: has_many_as.build does not set the inverse polymorphic belongs_to assoc on the new model
labels: With reproduction steps, activerecord, attached PR
layout: issue
---

as a result of that the `required: true` validation on the child fails when the parent is saved (comment out the `assert comment.commentable` line in the test)

and in general it's very misleading that it appears disconnected, there should be enough info to connect it.

``` ruby
begin
  require 'bundler/inline'
rescue LoadError => e
  $stderr.puts 'Bundler version 1.10 or later is required. Please update your Bundler'
  raise e
end

gemfile(true) do
  source 'https://rubygems.org'
  # Activate the gem you are reporting the issue against.
  gem 'activerecord', '4.2.4'
  gem 'sqlite3'
end

require 'active_record'
require 'minitest/autorun'
require 'logger'

# Ensure backward compatibility with Minitest 4
Minitest::Test = MiniTest::Unit::TestCase unless defined?(Minitest::Test)

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: ':memory:')
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :posts, force: true do |t|
  end

  create_table :comments, force: true do |t|
    t.belongs_to :commentable, polymorphic: true
  end
end

class Post < ActiveRecord::Base
  has_many :comments, as: :commentable
end

class Comment < ActiveRecord::Base
  belongs_to :commentable, polymorphic: true, required: true
end

class BugTest < Minitest::Test
  def test_association_stuff

    post = Post.new
    comment = post.comments.build
    assert comment.commentable
    post.save!

  end
end
```

