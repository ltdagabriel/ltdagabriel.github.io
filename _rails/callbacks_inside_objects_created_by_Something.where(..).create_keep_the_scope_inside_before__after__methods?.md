---
title: callbacks inside objects created by Something.where(..).create keep the scope inside before_/after_ methods?
labels: activerecord, needs feedback, stale
layout: issue
---

Below is a reproduction script. Note that when `Something.all.to_sql` is called inside the callback method, the `age: 28` condition is used. When we call a normal method, the `age: 28` condition is not kept. 

Is this a bug? Or expected behavior? If expected behavior, seems weird that the same method behaves differently when it's being used in an AR callback.

``` ruby
require 'active_record'

ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: ':memory:')

ActiveRecord::Schema.define do
  create_table :somethings, force: true do |t|
    t.text :name
    t.integer :age
  end
end

class Something < ActiveRecord::Base
  before_create :callback
  def no_callback
    puts "No callback: #{the_sql}"
    # No callback: SELECT "somethings".* FROM "somethings"
    # This is expected
  end

  def callback
    puts "Callback: #{the_sql}"
    # Callback: SELECT "somethings".* FROM "somethings" WHERE "somethings"."age" = 28
    # Why does the scope carry over?
  end

  def the_sql
    Something.all.to_sql
  end
end

Something.where(age: 28).create(name: 'joe').no_callback

# Also, first_or_initialize behaves differently than #first_or_create, there is different
# SQL generated inside the callback method.

puts "first or initialize"
s1 = Something.where(age: 20).first_or_initialize(name: 'bob')
s1.save
# Callback: SELECT "somethings".* FROM "somethings"

puts
puts "first or create"
s2 = Something.where(age: 30).first_or_create(name: 'joe')
# Callback: SELECT "somethings".* FROM "somethings" WHERE "somethings"."age" = 30
```

