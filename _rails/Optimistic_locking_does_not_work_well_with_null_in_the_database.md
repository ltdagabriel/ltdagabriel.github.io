---
title: Optimistic locking does not work well with null in the database
labels: activerecord, attached PR
layout: issue
---

I can't edit a record If lock_version field is NULL in database
### Steps to reproduce

``` ruby
require 'active_record'
require 'minitest/autorun'
require 'sqlite3'
require 'logger'

ActiveRecord::Base.establish_connection 'sqlite3::memory:'

ActiveRecord::Schema.define do
  create_table :posts do |t|
    t.string :name
    t.integer :lock_version
  end
end

class Post < ActiveRecord::Base
end

class BugTest < Minitest::Test
  def test_lock_version_without_default_value
    #Post.create!(name: 'First')
    ActiveRecord::Base.connection.execute("insert into posts(name) VALUES('Mark')")

    p1 = Post.find(1)
    p1.name = "Michael"
    p1.save
  end
end

```
### Expected behavior

Record should be updated
### Actual behavior

I see exception `ActiveRecord::StaleObjectError: Attempted to update a stale object: Post`
### System configuration

**Rails version**:
4.2.7

**Ruby version**:
ruby 2.1.8p440 (2015-12-16 revision 53160) [x86_64-darwin14.0]

