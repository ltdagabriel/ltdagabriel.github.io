---
title: ActiveRecord::StatementInvalid in Postgres when accessing associations through class methods
labels: PostgreSQL, activerecord
layout: issue
---

See https://gist.github.com/dmarkow/5806205 for a test case.

Given this code:

```
class Post < ActiveRecord::Base
  has_many :comments
end

class Comment < ActiveRecord::Base
  has_many :comments
  belongs_to :post
  scope :top_level, -> { where(comment_id: nil) }

  def self.foo
    top_level.to_a.collect { |comment|
      comment.comments.collect(&:id)
    }
  end
end
```

With a `Post` having two comments, and each of those comments having 3 nested comments, I would expect the output of `@post.comments.foo` to equal something like `[[2,3,4], [5,6,7]]`. This works as expected in Rails 3.2.x, but in Rails 4/master, an ActiveRecord::StatementInvalid exception is raised. The code within the `self.foo` method works just fine if it's used directly (e.g.. `@post.comments.top_level.to_a.collect { ... }`).

The query that triggers the exception is:

```
D, [2013-06-18T09:57:40.6492616917] DEBUG -- :   Comment Load (0.4ms)  SELECT "comments".* FROM "comments" WHERE "comments"."post_id" = $1 AND "comments"."comment_id" = $1 [["post_id", 1], ["comment_id", 1]]
```

And the exception is:

```
ActiveRecord::StatementInvalid: PG::Error: ERROR:  bind message supplies 2 parameters, but prepared statement "a4" requires 1

: SELECT "comments".* FROM "comments"  WHERE "comments"."post_id" = $1 AND "comments"."comment_id" = $1
```

For some reason, `$1` is being used for both `post_id` and `comment_id`, even though two bound variables (`post_id` and `comment_id`) were passed in.

In Rails 3.2.13, the values were directly interpolated into the query rather than bound as variables, so it worked fine:

```
D, [2013-06-18T10:00:39.7610257046] DEBUG -- :   Comment Load (0.2ms)  SELECT "comments".* FROM "comments" WHERE "comments"."post_id" = 1 AND "comments"."comment_id" = 1
```

Also, this seems postgresql specific. In sqlite3, `?` is used instead of `$1`, `$2`, etc., so the multiple bindings get passed in properly. I have not tested to see if this happens in MySQL.

Executable test case below:

``` ruby
unless File.exists?('Gemfile')
  File.write('Gemfile', <<-GEMFILE)
    source 'https://rubygems.org'
    gem 'rails', github: 'rails/rails'
    gem 'pg'
  GEMFILE

  system 'bundle'
end

require 'bundler'
Bundler.setup(:default)

require 'active_record'
require 'minitest/autorun'
require 'logger'

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: 'postgresql', database: 'test_ar')
ActiveRecord::Base.logger = Logger.new(STDOUT)

unless ActiveRecord::Base.connection.table_exists?('posts')
  ActiveRecord::Schema.define do
    create_table :posts do |t|
    end

    create_table :comments do |t|
      t.integer :post_id
      t.integer :comment_id
    end
  end
end

class Post < ActiveRecord::Base
  has_many :comments
end

class Comment < ActiveRecord::Base
  has_many :comments
  belongs_to :post
  scope :top_level, -> { where(comment_id: nil) }

  # Should return something like [[2,3,4]], but instead raises an error. The database call that
  # raises the error is:
  #
  # D, [2013-06-18T09:57:40.649261 #6917] DEBUG -- :   Comment Load (0.4ms)  SELECT "comments".*
  # FROM "comments" WHERE "comments"."post_id" = $1 AND "comments"."comment_id" = $1
  # [["post_id", 1], ["comment_id", 1]]
  #
  # And the exception is:
  #
  # ActiveRecord::StatementInvalid: PG::Error: ERROR:  bind message supplies 2 parameters,
  # but prepared statement "a4" requires 1
  #
  # : SELECT "comments".* FROM "comments"  WHERE "comments"."post_id" = $1 AND "comments"."comment_id" = $1
  #
  # For some reason, $1 is being used for both post_id and comment_id, even though two bound variables
  # (post_id and comment_id) were passed in.
  #
  # In Rails 3.2.13, the values were directly interpolated into the query rather than bound as variables:
  #
  # D, [2013-06-18T10:00:39.761025 #7046] DEBUG -- :   Comment Load (0.2ms)  SELECT "comments".*
  # FROM "comments" WHERE "comments"."post_id" = 1 AND "comments"."comment_id" = 1
  #
  # Also, this seems postgresql-specific. In sqlite3, `?` is used instead of `$1`, `$2`, etc., so the
  # multiple bindings get passed in properly.
  def self.foo
    top_level.to_a.collect { |comment|
      comment.comments.collect(&:id)
    }
  end
end

class BugTest < Minitest::Test
  def setup
    @post = Post.create!
    @comment = @post.comments.create!
    @sub_comments = 3.times.map { @comment.comments.create!(post_id: @post.id) }
  end

  def teardown
    Post.delete_all
    Comment.delete_all
  end

  def test_association_stuff
    expected = @post.comments.top_level.to_a.collect { |comment|
      comment.comments.collect(&:id)
    }
    assert_equal expected, @post.comments.foo
  end
end
```

