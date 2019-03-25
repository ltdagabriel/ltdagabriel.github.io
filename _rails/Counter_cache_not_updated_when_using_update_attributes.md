---
title: Counter cache not updated when using update_attributes
labels: stale
layout: issue
---

There is a bug in activerecord master (also tested to be present in 5.0.1, 4.2.8) where the callbacks to update the counter cache are not called when `update_attributes` is used instead of assigning a new model to the relevant `belongs_to` relations accessor with the counter cache.

It appears this bug is fixed already by the following unmerged PR #23357, which can be tested by switching the test case to @piotrj's `issue_23265` branch.

Here is the failing test case:

```ruby
begin
  require 'bundler/inline'
rescue LoadError => e
  $stderr.puts 'Bundler version 1.10 or later is required. Please update your Bundler'
  raise e
end

gemfile(true) do
  source 'https://rubygems.org'
  # gem 'activerecord', '4.2.8' # affected
  # gem 'activerecord', '5.0.1' # affected
  gem 'activerecord', github: 'rails/rails' # affected
  # gem 'activerecord', github: 'piotrj/rails', branch: 'issue_23265' # not affected
  gem 'sqlite3'
end

require 'active_record'
require 'minitest/autorun'
require 'logger'

# Ensure backward compatibility with Minitest 4
# Minitest::Test = MiniTest::Unit::TestCase unless defined?(Minitest::Test)

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: ':memory:')
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :nodes, force: true do |t|
    t.integer :parent_id
    t.integer :children_count, default: 0
  end
end

class Node < ActiveRecord::Base
  belongs_to :parent, class_name: name, inverse_of: :children, counter_cache: :children_count
  has_many :children, class_name: name, inverse_of: :parent
end

class BugTest < Minitest::Test

  def setup
    @root = Node.create!
    @child1 = Node.create! parent: @root
    @child2 = Node.create! parent: @root
  end

  # ok
  def test_counter_cache_initial_values_are_sane
    assert_equal 2, @root.reload.children_count
    assert_equal 0, @child1.reload.children_count
    assert_equal 0, @child2.reload.children_count
  end

  # ok
  def test_counter_cache_after_assign_new_parent
    @child2.parent = @child1
    @child2.save!
    assert_equal 1, @root.reload.children_count
    assert_equal 1, @child1.reload.children_count
  end

  # failing test
  def test_counter_cache_after_update_parent_id_attribute
    @child2.update_attributes(parent_id: @child1.id)
    assert_equal 1, @root.reload.children_count
    assert_equal 1, @child1.reload.children_count
  end

end
```
