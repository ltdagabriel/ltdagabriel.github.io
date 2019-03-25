---
title: AR: `joins` + `uniq` + `count` seems to ignore `uniq`
labels: activerecord, needs feedback
layout: issue
---

If i use `joins` followed by `uniq` on an `ActiveRecord` query, calling `count` on the result is inconsistent with iterating over it: it seems that `count` ignores `uniq`.

Probably i should use `includes` instead of `joins`, but this behavior still looks like a bug to me.

Here is a script to reproduce:

``` ruby
gem 'activerecord', '~>3.2.12'
require 'active_record'
require 'logger'

puts "Active Record #{ ActiveRecord::VERSION::STRING }"

# ActiveRecord::Base.logger = Logger.new(STDOUT)

# Connect to an in-memory sqlite3 database
ActiveRecord::Base.establish_connection( :adapter  => 'sqlite3',
                                         :database => ':memory:' )

# Create a database schema to reproduce the bug
ActiveRecord::Schema.define do
  create_table :users

  create_table :dogs do |t|
    t.integer :user_id
  end
end

# Create a set of models to reproduce the bug
class User < ActiveRecord::Base
  has_many :dogs
end

class Dog < ActiveRecord::Base
  belongs_to :user
end

# Create some test data
user = User.create!
2.times do user.dogs.create! end

# Inconsistent behavior:
puts "`User.joins(:dogs).uniq.all.count` evaluates to:"
puts User.joins(:dogs).uniq.all.count #  prints "1"

puts "`User.joins(:dogs).uniq.to_a.count` evaluates to:"
puts User.joins(:dogs).uniq.to_a.count #  prints "1"

puts "`User.joins(:dogs).uniq.count` evaluates to:"
puts User.joins(:dogs).uniq.count       # prints "2", why?
```

This does not happen with `includes` instead of `joins`: both results are 1 in that case.

