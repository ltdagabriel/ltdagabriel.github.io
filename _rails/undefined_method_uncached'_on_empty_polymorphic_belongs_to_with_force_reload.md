---
title: undefined method `uncached' on empty polymorphic belongs_to with force_reload
labels: activerecord
layout: issue
---

when calling the association method with `force_reload: true` on a uninitialized belongs_to association a `NoMethodError` is raised in `singular_association.rb:7` [1]

Other than a comment on an old issue refering to this line (#2386) I couldn't find anything useful on this issue. The error could be reproduced with Rails v4.1.10, v4.2.0 and master.

Any thoughts?

[1] Test case

``` ruby
unless File.exist?('Gemfile')
  File.write('Gemfile', <<-GEMFILE)
    source 'https://rubygems.org'
    gem 'rails', github: 'rails/rails'
    gem 'arel', github: 'rails/arel'
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
  create_table :posts, force: true  do |t|
  end

  create_table :comments, force: true  do |t|
    t.references :commentable, polymorphic: true, index: true
  end
end

class Post < ActiveRecord::Base
  has_one :comment, as: :commentable
end

class Comment < ActiveRecord::Base
  belongs_to :commentable, polymorphic: true
end

class BugTest < Minitest::Test
  def test_belongs_to_force_reload_nil
    assert_equal Comment.new.commentable(force_reload: true), nil
  end
end
```

[2] output

```
bakki :: devel/rails > ruby has_one_force_reload_nil_test.rb                                                                                                              1
-- create_table(:posts, {:force=>true})
D, [2015-06-03T21:20:08.012423 #32623] DEBUG -- :    (0.3ms)  CREATE TABLE "posts" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL)
   -> 0.0082s
-- create_table(:comments, {:force=>true})
D, [2015-06-03T21:20:08.013247 #32623] DEBUG -- :    (0.1ms)  CREATE TABLE "comments" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "commentable_type" varchar, "commentable_id" integer)
D, [2015-06-03T21:20:08.036462 #32623] DEBUG -- :    (0.1ms)  select sqlite_version(*)
D, [2015-06-03T21:20:08.036967 #32623] DEBUG -- :    (0.1ms)  CREATE  INDEX "index_comments_on_commentable_type_and_commentable_id" ON "comments" ("commentable_type", "commentable_id")
   -> 0.0244s
Run options: --seed 39301

# Running:

E

Finished in 0.009509s, 105.1660 runs/s, 0.0000 assertions/s.

  1) Error:
BugTest#test_has_one_force_reload_nil:
NoMethodError: undefined method `uncached' for nil:NilClass
    /Users/sdecaste/.rbenv/versions/2.2.2/lib/ruby/gems/2.2.0/bundler/gems/rails-ae5f2b4e79f3/activerecord/lib/active_record/associations/singular_association.rb:7:in `reader'
    /Users/sdecaste/.rbenv/versions/2.2.2/lib/ruby/gems/2.2.0/bundler/gems/rails-ae5f2b4e79f3/activerecord/lib/active_record/associations/builder/association.rb:111:in `commentable'
    has_one_force_reload_nil_test.rb:42:in `test_has_one_force_reload_nil'

1 runs, 0 assertions, 0 failures, 1 errors, 0 skips
```

