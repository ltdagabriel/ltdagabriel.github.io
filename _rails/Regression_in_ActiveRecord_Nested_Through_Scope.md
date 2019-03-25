---
title: Regression in ActiveRecord Nested Through Scope
labels: With reproduction steps, activerecord, regression
layout: issue
---

Given the ruby code in the script, I would expect `user.groups` to be scoped by both of the `deleted_at` conditions.  This was the behavior up thru Rails f55c60f.  This was changed in bc6ac860 to fix [a regression](https://github.com/rails/rails/issues/20727).  This issue persists thru master, test script runs against 5.0.0.beta1.  (This is possibly a dupe of #22723, given how `user.groups` is broken, but `group.users` works as expected)

Rails `f55c60f`

``` sql
SELECT "groups".* 
FROM "groups" 
INNER JOIN "assignments" 
ON "groups"."id" = "assignments"."assignable_id" 
WHERE "assignments"."deleted_at" IS NULL -- This is the missing clause
AND "assignments"."user_id" = 1 
AND "groups"."deleted_at" IS NULL 
AND "assignments"."assignable_type" = 'Group'
```

Rails `bc6ac8`

``` sql
SELECT "groups".* 
FROM "groups" 
INNER JOIN "assignments" 
ON "groups"."id" = "assignments"."assignable_id" 
WHERE "assignments"."user_id" = 1 
AND "groups"."deleted_at" IS NULL 
AND "assignments"."assignable_type" = 'Group'
```

Rails `HEAD`

``` sql
SELECT "groups".* 
FROM "groups" 
INNER JOIN "assignments" 
ON "groups"."id" = "assignments"."assignable_id" 
WHERE "assignments"."user_id" = 1 
AND "groups"."deleted_at" IS NULL 
AND "assignments"."assignable_type" = 'Group'
```

Test Script:

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
  gem 'activerecord', '5.0.0.beta1'
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
  create_table :users, force: true do |t|
    t.string :name

    t.timestamps
  end

  create_table :groups, force: true do |t|
    t.datetime :deleted_at
    t.string :name
  end

  create_table :assignments, force: true do |t|
    t.references :user
    t.references :assignable, polymorphic: true
    t.datetime :deleted_at
  end
end

class Group < ActiveRecord::Base
  has_many :assignments, -> { where deleted_at: nil }, :as => :assignable
  has_many :leaders, :through => :assignments, :source => :user
end

class Assignment < ActiveRecord::Base
  belongs_to :user
  belongs_to :assignable, polymorphic: true
end

class User < ActiveRecord::Base
  has_many :assignments, -> { where :deleted_at => nil }, :dependent => :destroy
  has_many :groups, -> { where :deleted_at => nil }, :through => :assignments, :source => :assignable, source_type: "Group"
end

class BugTest < Minitest::Test
  def test_association_stuff
    alice = User.create!(name: "Alice")
    bob = User.create!(name: "Bob")
    admins = Group.create!(name: "Admins")
    assignment1 = Assignment.create!(user: alice, assignable: admins, deleted_at: Time.now)
    assignment2 = Assignment.create!(user: bob, assignable: admins)

    assert admins.leaders.count == 1, "Admins should have only one leader"
    assert bob.groups.count == 1, "Bob should have one assignment"
    assert alice.groups.empty?, "Alice should have no assignments!"
  end
end
```

