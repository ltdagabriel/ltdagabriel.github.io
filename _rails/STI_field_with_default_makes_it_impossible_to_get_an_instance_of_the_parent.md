---
title: STI field with default makes it impossible to get an instance of the parent
labels: activerecord, attached PR
layout: issue
---

### Steps to reproduce

1. Add a default to the `type` field: `"ChildA"`.
2. ~~`Parent.new.class` returns `ChildA`~~ or `ChildB.new.becomes(Parent).class` returns `ChildA`

#### Test Case

I wrote and updated test case with this goals in mind:

* Keep the initialization functionality intact, as specified in #17169
* Ensure `becomes` behavior is predictable, for both children and parent classes.
* Keep `becomes!` functionality untouched. 

```ruby
begin
  require 'bundler/inline'
rescue LoadError => e
  $stderr.puts 'Bundler version 1.10 or later is required. Please update your Bundler'
  raise e
end

gemfile(true) do
  source 'https://rubygems.org'
  # Activate the gem you are reporting the issue against.
  gem 'activerecord', '~> 5.1.4'
  gem 'sqlite3'
end

require 'active_record'
require 'minitest/autorun'
require 'logger'

module ActiveRecord
  module Persistence
    def becomes(klass)
      if klass.descends_from_active_record? &&
         klass.attribute_names.include?(klass.inheritance_column)
        became = klass.new(klass.inheritance_column => klass.name)
      else
        became = klass.new
      end
      became.instance_variable_set("@attributes", @attributes)
      became.instance_variable_set("@mutation_tracker", @mutation_tracker) if defined?(@mutation_tracker)
      became.instance_variable_set("@changed_attributes", attributes_changed_by_setter)
      became.instance_variable_set("@new_record", new_record?)
      became.instance_variable_set("@destroyed", destroyed?)
      became.errors.copy!(errors)
      became
    end
  end
end

# Ensure backward compatibility with Minitest 4
Minitest::Test = MiniTest::Unit::TestCase unless defined?(Minitest::Test)

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: ':memory:')
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :parents, force: true do |t|
    t.string :type, default: 'ChildA'
  end
end

class Parent < ActiveRecord::Base
end

class ChildA < Parent
end

class ChildB < Parent
end

class BugTest < Minitest::Test
  def test_initialization_parent_with_default
    instance = Parent.new
    assert_equal instance.class, ChildA
  end

  def test_initialization_non_default_child
    instance = ChildB.new
    assert_equal instance.class, ChildB
  end

  def test_becomes_parent
    instance = ChildB.new.becomes(Parent)
    assert_equal instance.class, Parent
    assert_equal instance.type, 'ChildB'
  end

  def test_becomes_sibling
    instance = ChildB.new.becomes(ChildA)
    assert_equal instance.class, ChildA
    assert_equal instance.type, 'ChildB'
  end

  def test_becomes!
    instance = ChildA.new.becomes!(ChildB)
    assert_equal instance.class, ChildB
    assert_equal instance.type, 'ChildB'
  end
end
```

### Expected behavior

~~When creating and instance of the parent, it's class should remain untouched by the default value on the DB.~~ When using `.becomes(Parent)` it's class should be `Parent`.

### Actual behavior

When creating an instance of the parent, it's class is set by the default value in the DB. When using `.becomes(Parent)`, it's class is set by the default value on the DB.

The class of the 

### System configuration
**Rails version**: 5.x

**Ruby version**: 2.3.4

