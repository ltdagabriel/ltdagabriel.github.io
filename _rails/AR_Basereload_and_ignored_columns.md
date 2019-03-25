---
title: AR::Base#reload and ignored_columns
labels: With reproduction steps, activerecord, attached PR
layout: issue
---

The `ignored_columns` list is ignored after you do `reload` on a record:

On master:

```ruby
require 'bundler/setup'
require 'active_record'
require "minitest/autorun"
require "logger"

ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: ':memory:')
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table "users" do |t|
    t.string "name"
    t.integer "age"
  end
end

class User < ActiveRecord::Base
  self.ignored_columns = ["age"]
end

class BugTest < Minitest::Test
  def test_association_stuff
    user = User.create!
    refute user.respond_to?(:age) # passes
    refute user.respond_to?(:age=) # passes
    user.reload
    refute user.respond_to?(:age) # test fails here because `age` is not available
  end
end
```

I guess this happens because on reload we do `SELECT *`.
Do we consider it as a bug?

@sgrif @matthewd 
