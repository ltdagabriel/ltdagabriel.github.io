---
title: Aggregate methods (empty?, any?, count) generate invalid SQL
labels: activerecord
layout: issue
---

NOTE the two tests above are similar. Only tThe assertions order is different.
One is probably passing only because it has fetched the data on the `rel` while the other needs to use SQL `COUNT` to return the result for `#empty?`.

It could be related to #12405.

``` ruby
gem 'activerecord', '4.1.0.beta1'
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
    t.string :name
  end
end

class Blog < ActiveRecord::Base
end

class TestMe < MiniTest::Unit::TestCase
  def test_empty_then_to_a
    rel = Blog.select("blogs.*, 1234 as more")
    assert_equal rel.empty?, true # this fails
    assert_equal rel.to_a, []
  end

  def test_to_a_then_empty
    rel = Blog.select("blogs.*, 1234 as more")
    assert_equal rel.to_a, []
    assert_equal rel.empty?, true
  end
end
```

This fails with:

```
-- create_table(:blogs, {:force=>true})
D, [2014-01-09T17:10:07.364506 #21686] DEBUG -- :    (1.5ms)  DROP TABLE "blogs"
D, [2014-01-09T17:10:07.366782 #21686] DEBUG -- :    (2.1ms)  CREATE TABLE "blogs" ("id" serial primary key, "name" character varying(255)) 
   -> 0.0171s
MiniTest::Unit::TestCase is now Minitest::Test. From tmp/test-eager.rb:21:in `<main>'
Run options: --seed 22020

# Running:

D, [2014-01-09T17:10:07.438523 #21686] DEBUG -- :    (0.2ms)  SELECT COUNT(blogs.*, 1234 as more) FROM "blogs"
E, [2014-01-09T17:10:07.438591 #21686] ERROR -- : PG::SyntaxError: ERROR:  syntax error at or near "as"
LINE 1: SELECT COUNT(blogs.*, 1234 as more) FROM "blogs"
                                   ^
: SELECT COUNT(blogs.*, 1234 as more) FROM "blogs"
ED, [2014-01-09T17:10:07.439088 #21686] DEBUG -- :   Blog Load (0.2ms)  SELECT blogs.*, 1234 as more FROM "blogs"
.

Finished in 0.006772s, 295.3337 runs/s, 295.3337 assertions/s.

  1) Error:
TestMe#test_empty_then_to_a:
ActiveRecord::StatementInvalid: PG::SyntaxError: ERROR:  syntax error at or near "as"
LINE 1: SELECT COUNT(blogs.*, 1234 as more) FROM "blogs"
                                   ^
: SELECT COUNT(blogs.*, 1234 as more) FROM "blogs"
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/connection_adapters/postgresql_adapter.rb:798:in `exec'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/connection_adapters/postgresql_adapter.rb:798:in `block in exec_no_cache'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/connection_adapters/abstract_adapter.rb:359:in `block in log'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activesupport-4.1.0.beta1/lib/active_support/notifications/instrumenter.rb:20:in `instrument'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/connection_adapters/abstract_adapter.rb:353:in `log'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/connection_adapters/postgresql_adapter.rb:798:in `exec_no_cache'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/connection_adapters/postgresql/database_statements.rb:137:in `exec_query'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/connection_adapters/postgresql_adapter.rb:920:in `select'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/connection_adapters/abstract/database_statements.rb:23:in `select_all'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/connection_adapters/abstract/query_cache.rb:69:in `select_all'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/relation/calculations.rb:254:in `execute_simple_calculation'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/relation/calculations.rb:216:in `perform_calculation'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/relation/calculations.rb:111:in `calculate'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/relation/calculations.rb:26:in `count'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/relation.rb:251:in `empty?'
    tmp/test-eager.rb:24:in `test_empty_then_to_a'

2 runs, 2 assertions, 0 failures, 1 errors, 0 skips
```

