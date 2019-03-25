---
title: Regression in PostgreSQL HStore dirty check when key order changes
labels: PostgreSQL, With reproduction steps, activerecord, attached PR
layout: issue
---

### Steps to reproduce

This passes on Rails 4.2.7.1 but fails on Rails 5.0.1:

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
  gem "activerecord", "5.0.1"       # Fails
  #gem "activerecord", "4.2.7.1"    # Passes
  gem "pg"
end

require "active_record"
require "minitest/autorun"
require "logger"

# PostgreSQL Specific Issue
ActiveRecord::Base.establish_connection(adapter: 'postgresql', database: 'hstore_dirty')
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  enable_extension 'hstore' unless extension_enabled?('hstore')
  create_table :posts, force: true do |t|
    t.hstore 'settings'
  end
end

class Post < ActiveRecord::Base
end

class BugTest < Minitest::Test
  def setup
    @settings = { "alongkey" => "anything", "key" => "value" }
    @post = Post.create!(settings: @settings)
  end

  def test_hstore_dirty_from_user_no_change
    # @post.settings is: {"alongkey"=>"anything", "key"=>"value"}
    assert_equal @settings, @post.settings
    @post.settings = @settings
    refute @post.changed?
  end

  def test_hstore_dirty_from_user_no_equality_change
    # @post.settings is: {"alongkey"=>"anything", "key"=>"value"}
    assert_equal @settings, @post.settings
    @post.settings = { "key" => "value", "alongkey" => "anything" }
    assert_equal @settings, @post.settings
    refute @post.changed?
  end

  def test_hstore_dirty_from_database
    @post.reload
    # The value of @post.settings is dependent on how the database decides to
    # return the HStore. For my system on PostgreSQL 9.5.4 it seems to place
    # shorter keys before longer ones.
    #
    # At this point @post.settings is: {"key"=>"value", "alongkey"=>"anything"}
    assert_equal @settings, @post.settings
    @post.settings = @settings
    refute @post.changed?
  end
end
```

### Expected behavior

The record has no changes and should not be saved or marked as dirty.

### Actual behavior

The record thinks the HStore has changed. This is causing it to be saved resulting in a cascade of effects which should be avoided (e.g. updates the `updated_at` timestamp, causing `touch` association updates, busting caches and ETags).

### System configuration

**Rails version**: 5.0.1

**Ruby version**: 2.3.3

**PostgreSQL version**: 9.5.4
