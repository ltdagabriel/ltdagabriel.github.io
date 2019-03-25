---
title: Polymorphic eager loading is broken in Rails 4.1.0.beta1
labels: activerecord
layout: issue
---

See the full test case below.

It worked as expected in Rails 4.0.2 but is failing in the 4.1.0.beta1.

Note the custom JOIN (simplified for the sake of this example).

``` ruby
gem 'activerecord', '4.1.0.beta1'
#gem 'activerecord', '4.0.1'
require 'active_record'
require 'minitest/autorun'
require 'logger'
puts ActiveRecord::VERSION::STRING

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

  create_table :users, :force => true do |t|
  end

  create_table :versions, :force => true do |t|
    t.string :item_type
    t.integer :item_id
  end

end

class Blog < ActiveRecord::Base
  has_many :posts, :dependent => :destroy
  has_many :versions, :as => :item, class_name: "Version"
end

class Post < ActiveRecord::Base
  belongs_to :blog
  has_many :versions, :as => :item, class_name: "Version"
end

class User < ActiveRecord::Base
end

class Version < ActiveRecord::Base
  belongs_to :item, :polymorphic => true
end

class TestMe < MiniTest::Unit::TestCase
  def setup
    blog = Blog.create!
    post = blog.posts.create!
    post.versions.create!
    blog.versions.create!
    User.create!
  end

  def teardown
    Version.delete_all
    User.delete_all
    Post.delete_all
    Blog.delete_all
  end


  def test_eager_load_without_references
    versions = Version.all.joins("JOIN users ON users.id > 0").includes(:item).to_a
    assert_equal 2, versions.size
  end

  def test_eager_load_with_references
    versions = Version.all.joins("JOIN users ON users.id > 0").references(:users).includes(:item).to_a
    assert_equal 2, versions.size
  end
end
```

With the output:

```
4.1.0.beta1
-- create_table(:blogs, {:force=>true})
D, [2014-01-16T14:04:58.993273 #91928] DEBUG -- :    (81.1ms)  DROP TABLE "blogs"
D, [2014-01-16T14:04:59.123178 #91928] DEBUG -- :    (129.4ms)  CREATE TABLE "blogs" ("id" serial primary key) 
   -> 0.5312s
-- create_table(:posts, {:force=>true})
D, [2014-01-16T14:04:59.126707 #91928] DEBUG -- :    (1.5ms)  DROP TABLE "posts"
D, [2014-01-16T14:04:59.129545 #91928] DEBUG -- :    (2.6ms)  CREATE TABLE "posts" ("id" serial primary key, "blog_id" integer) 
   -> 0.0061s
-- create_table(:users, {:force=>true})
D, [2014-01-16T14:04:59.131971 #91928] DEBUG -- :    (1.2ms)  DROP TABLE "users"
D, [2014-01-16T14:04:59.134605 #91928] DEBUG -- :    (2.4ms)  CREATE TABLE "users" ("id" serial primary key) 
   -> 0.0050s
-- create_table(:versions, {:force=>true})
D, [2014-01-16T14:04:59.136812 #91928] DEBUG -- :    (0.9ms)  DROP TABLE "versions"
D, [2014-01-16T14:04:59.138624 #91928] DEBUG -- :    (1.5ms)  CREATE TABLE "versions" ("id" serial primary key, "item_type" character varying(255), "item_id" integer) 
   -> 0.0038s
MiniTest::Unit::TestCase is now Minitest::Test. From tmp/b.rb:49:in `<main>'
Run options: --seed 57863

# Running:

D, [2014-01-16T14:04:59.386652 #91928] DEBUG -- :    (0.3ms)  BEGIN
D, [2014-01-16T14:04:59.437824 #91928] DEBUG -- :   SQL (25.7ms)  INSERT INTO "blogs" DEFAULT VALUES RETURNING "id"
D, [2014-01-16T14:04:59.438737 #91928] DEBUG -- :    (0.3ms)  COMMIT
D, [2014-01-16T14:04:59.922797 #91928] DEBUG -- :    (0.3ms)  BEGIN
D, [2014-01-16T14:05:00.111121 #91928] DEBUG -- :   SQL (0.8ms)  INSERT INTO "posts" ("blog_id") VALUES ($1) RETURNING "id"  [["blog_id", 1]]
D, [2014-01-16T14:05:00.112175 #91928] DEBUG -- :    (0.4ms)  COMMIT
D, [2014-01-16T14:05:00.115773 #91928] DEBUG -- :    (0.3ms)  BEGIN
D, [2014-01-16T14:05:00.122388 #91928] DEBUG -- :   SQL (0.4ms)  INSERT INTO "versions" ("item_id", "item_type") VALUES ($1, $2) RETURNING "id"  [["item_id", 1], ["item_type", "Post"]]
D, [2014-01-16T14:05:00.122810 #91928] DEBUG -- :    (0.1ms)  COMMIT
D, [2014-01-16T14:05:00.123989 #91928] DEBUG -- :    (0.2ms)  BEGIN
D, [2014-01-16T14:05:00.124895 #91928] DEBUG -- :   SQL (0.2ms)  INSERT INTO "versions" ("item_id", "item_type") VALUES ($1, $2) RETURNING "id"  [["item_id", 1], ["item_type", "Blog"]]
D, [2014-01-16T14:05:00.125202 #91928] DEBUG -- :    (0.1ms)  COMMIT
D, [2014-01-16T14:05:00.127026 #91928] DEBUG -- :    (0.0ms)  BEGIN
D, [2014-01-16T14:05:00.128545 #91928] DEBUG -- :   SQL (0.4ms)  INSERT INTO "users" DEFAULT VALUES RETURNING "id"
D, [2014-01-16T14:05:00.129040 #91928] DEBUG -- :    (0.3ms)  COMMIT
D, [2014-01-16T14:05:00.766911 #91928] DEBUG -- :   SQL (0.6ms)  DELETE FROM "versions"
D, [2014-01-16T14:05:00.767719 #91928] DEBUG -- :   SQL (0.4ms)  DELETE FROM "users"
D, [2014-01-16T14:05:00.768443 #91928] DEBUG -- :   SQL (0.4ms)  DELETE FROM "posts"
D, [2014-01-16T14:05:00.769032 #91928] DEBUG -- :   SQL (0.3ms)  DELETE FROM "blogs"
ED, [2014-01-16T14:05:00.769643 #91928] DEBUG -- :    (0.1ms)  BEGIN
D, [2014-01-16T14:05:00.770765 #91928] DEBUG -- :   SQL (0.3ms)  INSERT INTO "blogs" DEFAULT VALUES RETURNING "id"
D, [2014-01-16T14:05:00.771230 #91928] DEBUG -- :    (0.1ms)  COMMIT
D, [2014-01-16T14:05:00.771921 #91928] DEBUG -- :    (0.1ms)  BEGIN
D, [2014-01-16T14:05:00.773367 #91928] DEBUG -- :   SQL (0.3ms)  INSERT INTO "posts" ("blog_id") VALUES ($1) RETURNING "id"  [["blog_id", 2]]
D, [2014-01-16T14:05:00.773879 #91928] DEBUG -- :    (0.2ms)  COMMIT
D, [2014-01-16T14:05:00.774530 #91928] DEBUG -- :    (0.1ms)  BEGIN
D, [2014-01-16T14:05:00.775941 #91928] DEBUG -- :   SQL (0.3ms)  INSERT INTO "versions" ("item_id", "item_type") VALUES ($1, $2) RETURNING "id"  [["item_id", 2], ["item_type", "Post"]]
D, [2014-01-16T14:05:00.776462 #91928] DEBUG -- :    (0.2ms)  COMMIT
D, [2014-01-16T14:05:00.777053 #91928] DEBUG -- :    (0.1ms)  BEGIN
D, [2014-01-16T14:05:00.778298 #91928] DEBUG -- :   SQL (0.3ms)  INSERT INTO "versions" ("item_id", "item_type") VALUES ($1, $2) RETURNING "id"  [["item_id", 2], ["item_type", "Blog"]]
D, [2014-01-16T14:05:00.778824 #91928] DEBUG -- :    (0.2ms)  COMMIT
D, [2014-01-16T14:05:00.779338 #91928] DEBUG -- :    (0.3ms)  BEGIN
D, [2014-01-16T14:05:00.780219 #91928] DEBUG -- :   SQL (0.4ms)  INSERT INTO "users" DEFAULT VALUES RETURNING "id"
D, [2014-01-16T14:05:00.780687 #91928] DEBUG -- :    (0.2ms)  COMMIT
D, [2014-01-16T14:05:00.781885 #91928] DEBUG -- :   Version Load (0.6ms)  SELECT "versions".* FROM "versions" JOIN users ON users.id > 0
D, [2014-01-16T14:05:00.788152 #91928] DEBUG -- :   Post Load (0.7ms)  SELECT "posts".* FROM "posts"  WHERE "posts"."id" IN (2)
D, [2014-01-16T14:05:00.804561 #91928] DEBUG -- :   Blog Load (0.3ms)  SELECT "blogs".* FROM "blogs"  WHERE "blogs"."id" IN (2)
D, [2014-01-16T14:05:00.805114 #91928] DEBUG -- :   SQL (0.2ms)  DELETE FROM "versions"
D, [2014-01-16T14:05:00.805434 #91928] DEBUG -- :   SQL (0.1ms)  DELETE FROM "users"
D, [2014-01-16T14:05:00.805814 #91928] DEBUG -- :   SQL (0.2ms)  DELETE FROM "posts"
D, [2014-01-16T14:05:00.806106 #91928] DEBUG -- :   SQL (0.1ms)  DELETE FROM "blogs"
.

Finished in 1.448509s, 1.3807 runs/s, 0.6904 assertions/s.

  1) Error:
TestMe#test_eager_load_with_references:
ActiveRecord::EagerLoadPolymorphicError: Can not eagerly load the polymorphic association :item
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/associations/join_dependency.rb:220:in `block in build'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/associations/join_dependency.rb:215:in `each'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/associations/join_dependency.rb:215:in `map'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/associations/join_dependency.rb:215:in `build'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/associations/join_dependency.rb:99:in `initialize'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/relation/finder_methods.rb:265:in `new'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/relation/finder_methods.rb:265:in `construct_join_dependency'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/relation/finder_methods.rb:245:in `find_with_associations'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/relation.rb:602:in `exec_queries'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/relation.rb:486:in `load'
    /Users/dnagir/.rvm/gems/ruby-2.0.0-p195/gems/activerecord-4.1.0.beta1/lib/active_record/relation.rb:230:in `to_a'
    tmp/b.rb:72:in `test_eager_load_with_references'

2 runs, 1 assertions, 0 failures, 1 errors, 0 skips
```

Thanks.

