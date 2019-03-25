---
title: Cannot redefine HABTM inside inherited class in Rails 4.1
labels: activerecord, regression
layout: issue
---

We have a class that repeats a parent HABTM definition due to some customization required (details ignored here). However, upgrading to Rails 4.1 breaks this - we can no longer save any child class objects as the foreign key on the join table is no longer assigned.

Reproducible code:

```
# Activate the gem you are reporting the issue against.
gem 'activerecord', '4.1.0'
require 'active_record'
require 'minitest/autorun'
require 'logger'

# Ensure backward compatibility with Minitest 4
Minitest::Test = MiniTest::Unit::TestCase unless defined?(Minitest::Test)

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: ':memory:')
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :parents, force: true
  create_table :comments, force: true
  create_table :comments_parents, id: false, force: true do |t|
    t.integer "parent_id"
    t.integer "comment_id"
  end
end

class Comment < ActiveRecord::Base
end

class Parent < ActiveRecord::Base
  has_and_belongs_to_many :comments, -> { uniq }, join_table: 'comments_parents', class_name: 'Comment', foreign_key: 'parent_id'
end

class Child < Parent
  has_and_belongs_to_many :comments, -> { uniq }, join_table: 'comments_parents', class_name: 'Comment', foreign_key: 'parent_id'
end

class BugTest < Minitest::Test
  def test_association_stuff
    child = Child.new
    child.comments << Comment.new

    assert_equal true, child.save
  end
end
```

`active_record` 4.0.4 output:

```
D, [2014-05-05T17:13:16.050481 #36769] DEBUG -- :    (0.0ms)  begin transaction
D, [2014-05-05T17:13:16.053998 #36769] DEBUG -- :   SQL (0.1ms)  INSERT INTO "parents" DEFAULT VALUES
D, [2014-05-05T17:13:16.054934 #36769] DEBUG -- :   SQL (0.0ms)  INSERT INTO "comments" DEFAULT VALUES
D, [2014-05-05T17:13:16.057548 #36769] DEBUG -- :    (0.1ms)  INSERT INTO "comments_parents" ("parent_id", "comment_id") VALUES (1, 1)
D, [2014-05-05T17:13:16.057734 #36769] DEBUG -- :    (0.0ms)  commit transaction
.
```

`active_record` 4.1.0 output:

```
D, [2014-05-05T17:18:27.812791 #41289] DEBUG -- :    (0.0ms)  begin transaction
D, [2014-05-05T17:18:27.815476 #41289] DEBUG -- :   SQL (0.1ms)  INSERT INTO "parents" DEFAULT VALUES
D, [2014-05-05T17:18:27.815950 #41289] DEBUG -- :   SQL (0.0ms)  INSERT INTO "comments" DEFAULT VALUES
D, [2014-05-05T17:18:27.818071 #41289] DEBUG -- :   SQL (0.1ms)  INSERT INTO "comments_parents" ("comment_id") VALUES (?)  [["comment_id", 1]]
D, [2014-05-05T17:18:27.818985 #41289] DEBUG -- :   SQL (0.2ms)  UPDATE "comments_parents" SET "parent_id" = ? WHERE "comments_parents"."" IS NULL  [["parent_id", 1]]
E, [2014-05-05T17:18:27.819024 #41289] ERROR -- : SQLite3::SQLException: no such column: comments_parents.: UPDATE "comments_parents" SET "parent_id" = ? WHERE "comments_parents"."" IS NULL
D, [2014-05-05T17:18:27.819220 #41289] DEBUG -- :    (0.1ms)  rollback transaction
E
```

