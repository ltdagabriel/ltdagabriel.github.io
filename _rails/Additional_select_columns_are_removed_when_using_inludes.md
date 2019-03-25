---
title: Additional select columns are removed when using `inludes`
labels: activerecord, stale
layout: issue
---

Repro:

``` ruby
gem 'activerecord', '4.0.0'
require 'active_record'
require 'minitest/autorun'
require 'logger'

ActiveRecord::Base.logger = Logger.new(STDOUT)
ActiveRecord::Base.establish_connection(
  :adapter  => 'postgresql',
  :database => 'x'
)

ActiveRecord::Schema.define do
  create_table :blogs, :force => true do |t|
  end

  create_table :posts, :force => true do |t|
    t.integer :blog_id
  end
end

class Blog < ActiveRecord::Base
  has_many :posts, :dependent => :destroy
end

class Post < ActiveRecord::Base
  belongs_to :blog
end

class TestMe < MiniTest::Unit::TestCase
  def test_includes_with_additional_column
    blog = Blog.create!
    blogs = Blog.select(Blog.column_names + ["'foo' as foo"]).references(:posts).includes(:posts).order('foo').to_a
    assert_equal [blog], blogs
    assert_equal 'foo', blogs.first.foo
  end
end
```

Test fails with:

```
-- create_table(:blogs, {:force=>true})
D, [2013-10-02T17:55:54.494325 #57438] DEBUG -- :    (1.6ms)  DROP TABLE "blogs"
D, [2013-10-02T17:55:54.496579 #57438] DEBUG -- :    (2.1ms)  CREATE TABLE "blogs" ("id" serial primary key) 
   -> 0.0163s
-- create_table(:posts, {:force=>true})
D, [2013-10-02T17:55:54.498144 #57438] DEBUG -- :    (0.7ms)  DROP TABLE "posts"
D, [2013-10-02T17:55:54.499617 #57438] DEBUG -- :    (1.3ms)  CREATE TABLE "posts" ("id" serial primary key, "blog_id" integer) 
   -> 0.0030s
MiniTest::Unit::TestCase is now Minitest::Test. From tmp/test.rb:29:in `<main>'
Run options: --seed 30747

# Running:

D, [2013-10-02T17:55:54.531233 #57438] DEBUG -- :    (0.1ms)  BEGIN
D, [2013-10-02T17:55:54.536553 #57438] DEBUG -- :   SQL (0.5ms)  INSERT INTO "blogs" DEFAULT VALUES RETURNING "id"
D, [2013-10-02T17:55:54.536987 #57438] DEBUG -- :    (0.1ms)  COMMIT
D, [2013-10-02T17:55:54.545380 #57438] DEBUG -- :   SQL (0.4ms)  SELECT "blogs"."id" AS t0_r0, "posts"."id" AS t1_r0, "posts"."blog_id" AS t1_r1 FROM "blogs" LEFT OUTER JOIN "posts" ON "posts"."blog_id" = "blogs"."id" ORDER BY foo
E, [2013-10-02T17:55:54.545437 #57438] ERROR -- : PG::UndefinedColumn: ERROR:  column "foo" does not exist
LINE 1: ...IN "posts" ON "posts"."blog_id" = "blogs"."id"  ORDER BY foo
                                                                    ^
: SELECT "blogs"."id" AS t0_r0, "posts"."id" AS t1_r0, "posts"."blog_id" AS t1_r1 FROM "blogs" LEFT OUTER JOIN "posts" ON "posts"."blog_id" = "blogs"."id"  ORDER BY foo
E

Finished in 0.018798s, 53.1971 runs/s, 0.0000 assertions/s.

  1) Error:
TestMe#test_includes_with_additional_column:
ActiveRecord::StatementInvalid: PG::UndefinedColumn: ERROR:  column "foo" does not exist
LINE 1: ...IN "posts" ON "posts"."blog_id" = "blogs"."id"  ORDER BY foo
                                                                    ^
: SELECT "blogs"."id" AS t0_r0, "posts"."id" AS t1_r0, "posts"."blog_id" AS t1_r1 FROM "blogs" LEFT OUTER JOIN "posts" ON "posts"."blog_id" = "blogs"."id"  ORDER BY foo
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.0.0/lib/active_record/connection_adapters/postgresql_adapter.rb:768:in `exec'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.0.0/lib/active_record/connection_adapters/postgresql_adapter.rb:768:in `exec_no_cache'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.0.0/lib/active_record/connection_adapters/postgresql/database_statements.rb:138:in `block in exec_query'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.0.0/lib/active_record/connection_adapters/abstract_adapter.rb:425:in `block in log'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activesupport-4.0.0/lib/active_support/notifications/instrumenter.rb:20:in `instrument'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.0.0/lib/active_record/connection_adapters/abstract_adapter.rb:420:in `log'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.0.0/lib/active_record/connection_adapters/postgresql/database_statements.rb:137:in `exec_query'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.0.0/lib/active_record/connection_adapters/postgresql_adapter.rb:885:in `select'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.0.0/lib/active_record/connection_adapters/abstract/database_statements.rb:24:in `select_all'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.0.0/lib/active_record/connection_adapters/abstract/query_cache.rb:63:in `select_all'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.0.0/lib/active_record/relation/finder_methods.rb:206:in `find_with_associations'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.0.0/lib/active_record/relation.rb:585:in `exec_queries'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.0.0/lib/active_record/relation.rb:471:in `load'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.0.0/lib/active_record/relation.rb:220:in `to_a'
    tmp/test.rb:32:in `test_includes_with_additional_column'

1 runs, 0 assertions, 0 failures, 1 errors, 0 skips
```

