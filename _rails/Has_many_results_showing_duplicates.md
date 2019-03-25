---
title: Has many results showing duplicates
labels: activerecord, attached PR
layout: issue
---

This issue seems to have been introduced with https://github.com/rails/rails/pull/12359.

It basically boils down to when a callback of the has_many association calls a method on the parent object that calls the has many association.

Here's the script to reproduce the issue:

``` rb
unless File.exist?('Gemfile')
  File.write('Gemfile', <<-GEMFILE)
    source 'https://rubygems.org'
    gem 'rails', github: 'rails/rails'
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
  end

  create_table :comments do |t|
    t.integer :post_id
  end
end

class Post < ActiveRecord::Base
  has_many :comments, inverse_of: :post

  def some_method_that_calls_comments
    comments.to_a
  end
end

class Comment < ActiveRecord::Base
  belongs_to :post, inverse_of: :comments

  after_save :call_post_method

  def call_post_method
    post.some_method_that_calls_comments
  end
end

class BugTest < Minitest::Test
  def test_association_stuff
    post = Post.create!
    post.comments << Comment.new

    assert_equal 1, post.comments.count
    assert_equal 1, post.comments.to_a.count
  end
end
```

Results:

```
-- create_table(:posts)
D, [2013-12-18T11:27:02.810647 #84927] DEBUG -- :    (0.4ms)  CREATE TABLE "posts" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL) 
   -> 0.0053s
-- create_table(:comments)
D, [2013-12-18T11:27:02.811119 #84927] DEBUG -- :    (0.1ms)  CREATE TABLE "comments" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "post_id" integer) 
   -> 0.0004s
Run options: --seed 4633

# Running:

D, [2013-12-18T11:27:02.830074 #84927] DEBUG -- :    (0.0ms)  begin transaction
D, [2013-12-18T11:27:02.833123 #84927] DEBUG -- :   SQL (0.6ms)  INSERT INTO "posts" DEFAULT VALUES
D, [2013-12-18T11:27:02.833382 #84927] DEBUG -- :    (0.0ms)  commit transaction
D, [2013-12-18T11:27:02.840958 #84927] DEBUG -- :    (0.0ms)  begin transaction
D, [2013-12-18T11:27:02.846605 #84927] DEBUG -- :   SQL (0.2ms)  INSERT INTO "comments" ("post_id") VALUES (?)  [["post_id", 1]]
D, [2013-12-18T11:27:02.847181 #84927] DEBUG -- :   Comment Load (0.1ms)  SELECT "comments".* FROM "comments"  WHERE "comments"."post_id" = ?  [["post_id", 1]]
D, [2013-12-18T11:27:02.848370 #84927] DEBUG -- :    (0.0ms)  commit transaction
[#<Comment id: 1, post_id: 1>, #<Comment id: 1, post_id: 1>]
D, [2013-12-18T11:27:02.848978 #84927] DEBUG -- :    (0.1ms)  SELECT COUNT(*) FROM "comments"  WHERE "comments"."post_id" = ?  [["post_id", 1]]
F

Finished in 0.027382s, 36.5203 runs/s, 73.0407 assertions/s.

  1) Failure:
BugTest#test_association_stuff [inverse_of_has_many_bug.rb:55]:
Expected: 1
  Actual: 2

1 runs, 2 assertions, 1 failures, 0 errors, 0 skips
```

This happens on master and on 3-2-stable.

