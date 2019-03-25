---
title: Regression in ActiveRecord 4.2.1 - ActiveRecord::UnknownPrimaryKey when the current table is used as a where clause
labels: With reproduction steps, activerecord, attached PR
layout: issue
---

## Synopsis

Selecting from a table while using the same table as a `where` clause complains with `ActiveRecord::UnknownPrimaryKey: Unknown primary key for table`:

``` ruby
UserGroup.where(group: UserGroup.all.select(:group_id))
```

This worked correctly in ActiveRecord 4.1.8 and 4.2.0.
## Reproduction

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
  gem 'activerecord', '4.2.1'
  # gem 'activerecord', '4.1.8'
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
  create_table :user_groups, id: false, force: true do |t|
    t.integer :group_id
  end

  create_table :groups, force: true do |t|
    t.integer :post_id
  end
end

class UserGroup < ActiveRecord::Base
  belongs_to :group
end

class Group < ActiveRecord::Base
  has_many :user_groups
end

class BugTest < Minitest::Test
  def test_association_stuff
    group = Group.create!
    user_group = group.user_groups.create!

    groups = UserGroup.where(group: UserGroup.all.select(:group_id))

    assert_equal [user_group.id], groups.map(&:id)
  end
end
```
## Stack trace

```
ActiveRecord::UnknownPrimaryKey: Unknown primary key for table user_groups in model UserGroup.
    /Users/jakegoulding/.rvm/gems/ruby-2.1.5/gems/activerecord-4.2.1/lib/active_record/reflection.rb:571:in `primary_key'
    /Users/jakegoulding/.rvm/gems/ruby-2.1.5/gems/activerecord-4.2.1/lib/active_record/reflection.rb:315:in `association_primary_key'
    /Users/jakegoulding/.rvm/gems/ruby-2.1.5/gems/activerecord-4.2.1/lib/active_record/relation/predicate_builder.rb:68:in `expand'
    /Users/jakegoulding/.rvm/gems/ruby-2.1.5/gems/activerecord-4.2.1/lib/active_record/relation/predicate_builder.rb:43:in `block in build_from_hash'
    /Users/jakegoulding/.rvm/gems/ruby-2.1.5/gems/activerecord-4.2.1/lib/active_record/relation/predicate_builder.rb:21:in `each'
    /Users/jakegoulding/.rvm/gems/ruby-2.1.5/gems/activerecord-4.2.1/lib/active_record/relation/predicate_builder.rb:21:in `build_from_hash'
    /Users/jakegoulding/.rvm/gems/ruby-2.1.5/gems/activerecord-4.2.1/lib/active_record/relation/query_methods.rb:960:in `build_where'
    /Users/jakegoulding/.rvm/gems/ruby-2.1.5/gems/activerecord-4.2.1/lib/active_record/relation/query_methods.rb:584:in `where!'
    /Users/jakegoulding/.rvm/gems/ruby-2.1.5/gems/activerecord-4.2.1/lib/active_record/relation/query_methods.rb:574:in `where'
    /Users/jakegoulding/.rvm/gems/ruby-2.1.5/gems/activerecord-4.2.1/lib/active_record/querying.rb:10:in `where'
    repro.rb:50:in `test_association_stuff'
```

