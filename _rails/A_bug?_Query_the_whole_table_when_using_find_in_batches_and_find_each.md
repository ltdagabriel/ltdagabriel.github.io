---
title: A bug? Query the whole table when using find_in_batches and find_each
labels: activerecord, attached PR
layout: issue
---

### Steps to reproduce

Supposing we use MySQL and  we have a model named "User" like this:

``` ruby
class User < ActiveRecord::Base
end
```

The table "users" have 100 million records in all.

When I use this query "User.find_in_batches", it generates a SQL:
"User Load (0.5ms)  SELECT `users`.\* FROM `users`" .

And this will take a very very long time and occupy much memory.

However, it do work well with a "each" and a block followed:

``` ruby
User.find_in_batches.each do |users|
    p users
end
```

The same problem with method "find_each".

So is this a bug?
### Expected behavior

I expect this query "User.find_in_batches" to generate some SQL like this:
"User Load (0.4ms)  SELECT  `users`.\* FROM `users`  ORDER BY `users`.`id` ASC LIMIT 1000"
### Actual behavior

Actually it generates a SQL and take a very very long time:
"User Load (0.5ms)  SELECT `users`.\* FROM `users`" .
### System configuration

**Rails version**:
Both Rails 4.2.6 and Rails v5.0.0.rc2.
**Ruby version**:
2.3.0
### Script

``` ruby
begin require 'bundler/inline'
rescue LoadError => e
  $stderr.puts 'Bundler version 1.10 or later is required. Please update your Bundler'
  raise e
end

gemfile(true) do
  source 'https://rubygems.org'
  gem 'rails', github: 'rails/rails'
  gem 'sqlite3'
end

require 'active_record'
require 'minitest/autorun'
require 'logger'

ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: ':memory:')
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :users, force: true do |t|
  end
end

class User < ActiveRecord::Base
end

class BugTest < Minitest::Test
   10.times { User.create }

  # When I try 'User.find_in_batches' in rails console, it generates a SQL like this, which is not expected:
  # D, [2016-06-28T10:15:20.042833 #65205] DEBUG -- :   User Load (0.4ms)  SELECT `users`.* FROM `users`
  def test_find_in_batches
    User.find_in_batches.inspect
  end

  # It generates a SQL like this also, which is not expected:
  # D, [2016-06-28T10:15:20.042833 #65205] DEBUG -- :   User Load (0.4ms)  SELECT `users`.* FROM `users`
  def test_find_each
    User.find_each.inspect
  end
end

```
### Other Information and what I have tried

I try to find the solution to this problem.And these are what I have done:

1, I read the source code(Rails 4.2.6) of this method "find_in_batches":

``` ruby
module ActiveRecord
  module Batches
    def find_in_batches(options = {})
      options.assert_valid_keys(:start, :batch_size)

      relation = self
      start = options[:start]
      batch_size = options[:batch_size] || 1000

      unless block_given?
        return to_enum(:find_in_batches, options) do
          total = start ? where(table[primary_key].gteq(start)).size : size
          (total - 1).div(batch_size) + 1
        end
      end

      if logger && (arel.orders.present? || arel.taken.present?)
        logger.warn("Scoped order and limit are ignored, it's forced to be batch order and batch size")
      end

      relation = relation.reorder(batch_order).limit(batch_size)
      records = start ? relation.where(table[primary_key].gteq(start)).to_a : relation.to_a

      while records.any?
        records_size = records.size
        primary_key_offset = records.last.id
        raise "Primary key not included in the custom select clause" unless primary_key_offset

        yield records

        break if records_size < batch_size

        records = relation.where(table[primary_key].gt(primary_key_offset)).to_a
      end
    end

....
  end
end
```

And I found the problem is here:

``` ruby
 unless block_given?
        return to_enum(:find_in_batches, options) do
          total = start ? where(table[primary_key].gteq(start)).size : size
          (total - 1).div(batch_size) + 1
        end
   end
```

2, Then I found that this "to_enum " method is from ruby "Object#to_enum", am I right?
But I cannot figure out what is the essence of this method.

3, I work with "pry", and I found that the problem really occurs here:

``` ruby
 return to_enum(:find_in_batches, options) do
          total = start ? where(table[primary_key].gteq(start)).size : size
          (total - 1).div(batch_size) + 1
        end
```

Any help will be appreciated. Thanks!

