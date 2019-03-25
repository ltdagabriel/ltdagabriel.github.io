---
title: Regression in 5.2.0: `unscoped` with a block no longer behaves the same as `unscoped`
labels: activerecord, regression
layout: issue
---

While working on upgrading from Rails 5.1 -> Rails 5.2 we found an issue where the behavior of `unscoped` changed when used with a block. The PR that changed behavior is https://github.com/rails/rails/pull/29301

Essentially what is happening is when `unscoped { all }` used to have the behavior of `Organization.where(id: org.id).unscoped { Organization.all }` but now has the behavior of `Organizatio.where(id: org.id).unscoped { Organization.where(id: org.id).all }` - where the scope is re-applied inside the block. 

The new behavior kind of makes sense to me but I think it's a surprising change with strange side effects. We wouldn't have found this if we hadn't been explicitly testing the sql in our application.

cc/ @kamipo @matthewd @rafaelfranca for the original pr 
cc/ @jhawthorn @tenderlove for GitHub visibility

### Steps to reproduce

```ruby
# frozen_string_literal: true

require "active_record"
require "minitest/autorun"
require "logger"

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: "sqlite3", database: ":memory:")
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :organizations, force: true do |t|
    t.string :name
  end
end

class Organization < ActiveRecord::Base
  scope :with_block, -> (org) do
    unscoped do
      all
    end
  end

  scope :without_block, -> (org) do
    unscoped.all
  end
end

class BugTest < Minitest::Test
  # pass
  def test_unscoped_without_block_stuff
    org = Organization.create! name: 'GitHub'

    assert_equal Organization.all.to_sql, Organization.where(id: org.id).without_block(org).to_sql
  end

  # fail
  def test_unscoped_with_block_stuff
    org = Organization.create! name: 'GitHub'

    # The problem is we're essentially calling `org_where` with `all`. In the non-block version
    # we're not doing that
    # org_where.unscoped { org_where.all }.to_sql
    assert_equal Organization.all.to_sql, Organization.where(id: org.id).with_block(org).to_sql
  end
end
```


### Expected behavior

The scope should not be re-applied inside the `unscoped` block. `unscoped { all }` should behave the same as `unscoped.all`.

### Actual behavior

When using unscoped with a block the outside scope is re-applied inside the scope.

### System configuration
**Rails version**: 5.2.0, master

**Ruby version**: 2.5.0

