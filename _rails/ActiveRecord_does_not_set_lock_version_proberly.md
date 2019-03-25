---
title: ActiveRecord does not set lock_version proberly
labels: activerecord
layout: issue
---

Hi,

like described here #18135. `lock_version` has with Rails 4.2 no longer the magic it had have before.
Until Rails 4.2 `lock_version` was set to 0 within the database even when the `lock_version` column hadn't have a default value. Now it is set to null. So I can't find a record with `lock_version` 0.

Example:

``` ruby
unless File.exist?('Gemfile')
  File.write('Gemfile', <<-GEMFILE)
source 'https://rubygems.org'
gem 'rails'
gem 'arel'
gem 'sqlite3'
  GEMFILE
  system 'bundle'
end

require 'bundler'
Bundler.setup(:default)
require 'active_record'
require 'minitest/autorun'
require 'logger'
# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: ':memory:')
ActiveRecord::Base.logger = Logger.new(STDOUT)
ActiveRecord::Schema.define do
  create_table :posts do |t|
    t.integer :lock_version
  end
end

class Post < ActiveRecord::Base

end

class BugTest < Minitest::Test
  def test_lock_version_default_value
    post = Post.create!
    assert_equal 0, post.lock_version
  end

  def test_lock_version_after_reload
    post = Post.create!
    loaded_post = Post.find(post.id)

    # use read_attribute_before_type_cast because nil is converted to 0 for this column
    assert_equal "0", loaded_post.read_attribute_before_type_cast('lock_version').to_s
  end

  def test_lock_version_0
    post = Post.create!
    loaded_post = Post.where(id: post.id, lock_version: post.lock_version).first

    assert_equal post.id, loaded_post.id
  end
end

```

