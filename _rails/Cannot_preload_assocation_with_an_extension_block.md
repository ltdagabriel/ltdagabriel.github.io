---
title: Cannot preload assocation with an extension block
labels: activerecord
layout: issue
---

It is not possible to preload a scoped association which has an extension block. 
This is because the association scope - which is _not_ instance dependant - is wrapped in a proc with parameters.
It looks like the fix from #18467 is not present in the Rails 5/master branch.
### Runnable test

``` ruby
gem 'activerecord', '5.0.0.beta3'
require 'active_record'
require 'minitest/autorun'

ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: ':memory:')
ActiveRecord::Base.default_timezone = :local

ActiveRecord::Schema.define do
  create_table(:parents)
  create_table(:children) { |t| t.integer :parent_id }
end

class Parent < ActiveRecord::Base
  has_many :children, ->() { order('id DESC') }, dependent: :destroy do
  end
end

class Child < ActiveRecord::Base
end

class Bug < Minitest::Test
  def test_preloading_of_associations
    Parent.create!
    Parent.create!
    Parent.includes(:children).to_a
  end
end
```
### Expected behavior

There should be no runtime error.
### Actual behavior

`Parent.includes(:children).to_a` triggers a runtime error:

> ArgumentError: The association scope 'children' is instance dependent (the scope block takes an argument). Preloading instance dependent scopes is not supported.
### System configuration

**Rails version**: 5.0.0.beta3

**Ruby version**: 2.2.4

