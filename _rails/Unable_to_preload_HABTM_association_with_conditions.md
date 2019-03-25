---
title: Unable to preload HABTM association with conditions
labels: With reproduction steps, activerecord
layout: issue
---

I have been performing migration from Rails 4.0 to Rails 4.2 and faced problem with preloading of HABTM associations with conditions. Take a look on the following test:

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
  gem 'activerecord', '4.2.0'
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
    t.boolean :published
  end

  create_table :groups, force: true do |t|
  end

  create_join_table(:posts, :groups)
end

class Post < ActiveRecord::Base
  has_and_belongs_to_many :groups
end

class Group < ActiveRecord::Base
  has_and_belongs_to_many :posts
  has_and_belongs_to_many :published_posts, -> { where(published: true) }, class_name: "Post"
end

class BugTest < Minitest::Test
  def test_preloading_of_relation_with_conditions
    group = Group.create!

    group.posts.create!(published: false)
    group.posts.create!(published: true)
    group.posts.create!(published: true)

    # Following code will raise an error because relation should be filtered by column of table "posts"

    Group.where(id: [group.id]).preload(:published_posts).each do |g|
      g.published_posts.to_a
    end

    # Booom! SQLite3::SQLException: no such column: posts.published:
    # SELECT "groups_posts".* FROM "groups_posts"
    # WHERE "posts"."published" = 't' AND "groups_posts"."group_id" IN (1)

  end
end
```

