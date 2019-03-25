---
title: AR causes stack level too deep when joining tables
labels: With reproduction steps, activerecord, attached PR
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

  def self.test_it
    current_scope.to_sql
  end
end

class Comment < ActiveRecord::Base
  belongs_to :post
end

class BugTest < Minitest::Test
  def test_through_joins
    Post.joins(comments: :post).test_it
  end
end
```
### Expected behavior

Should work same as in AR4.2.6 (I hope).

``` ruby
begin
  require 'bundler/inline'
rescue LoadError => e
  $stderr.puts 'Bundler version 1.10 or later is required. Please update your Bundler'
  raise e
end

gemfile(true) do
  source 'https://rubygems.org'
  gem 'activerecord', '4.2.6'
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

  def self.test_it
    current_scope.to_sql
  end
end

class Comment < ActiveRecord::Base
  belongs_to :post
end

class BugTest < Minitest::Test
  def test_through_joins
    Post.joins(comments: :post).test_it
  end
end
```
### Actual behavior

Raises 

``` BugTest#test_through_joins:
SystemStackError: stack level too deep
```
### System configuration

**Rails version**: 5.0.0

**Ruby version**: 2.2.4

