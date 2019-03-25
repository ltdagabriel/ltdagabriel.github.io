---
title: Cannot Eager Load has_many :through Relationships Defined by a Scope With Joins
labels: activerecord, attached PR
layout: issue
---

### Steps to reproduce

```rb
# Stolen from @adamlogic on #26780
begin
  require "bundler/inline"
rescue LoadError => e
  $stderr.puts "Bundler version 1.10 or later is required. Please update your Bundler"
  raise e
end

gemfile(true) do
  source "http://rubygems.org"
  gem "activerecord"#, "5.0.0"
  gem "sqlite3"
  gem "pry"
end

require "pry"
require "active_record"
require "minitest/autorun"
require "logger"

Minitest::Test = MiniTest::Unit::TestCase unless defined?(Minitest::Test)

ActiveRecord::Base.establish_connection(adapter: "sqlite3", database: ":memory:")
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :deals, force: true do |t|
  end

  create_table :deal_areas, force: true do |t|
    t.integer :deal_id
    t.integer :area_id
  end

  create_table :areas, force: true do |t|
    t.boolean :deleted
    t.integer :owner_id
  end

  create_table :owners, force: true do |t|
    t.boolean :admin
  end
end

class Deal < ActiveRecord::Base
  has_many :deal_areas
  has_many :failing_areas, -> { with_admin }, through: :deal_areas, class_name: "Area", source: :area
  has_many :working_areas, -> { not_deleted }, through: :deal_areas, class_name: "Area", source: :area
end

class DealArea < ActiveRecord::Base
  belongs_to :deal
  belongs_to :area
end

class Owner < ActiveRecord::Base
  has_many :areas
end

class Area < ActiveRecord::Base
  belongs_to :owner

  scope :with_admin, -> { joins(:owner).where(owner: { admin: true }) }
  scope :not_deleted, -> { where(deleted: false) }
end

class BugTest < Minitest::Test
  def setup
    owner = Owner.create!(admin: true)
    @deal = Deal.create!
    @deal.failing_areas.create!(owner: owner)
  end

  def teardown
    @deal.destroy
  end

  def test_through_with_scope_no_joins
    assert_equal [@deal.id], Deal.includes(:working_areas).references(:working_areas).map(&:id)
  end

  def test_through_with_scope_with_joins
    assert_equal [@deal.id], Deal.includes(:failing_areas).references(:failing_areas).map(&:id)
  end
end
```
### Expected behavior

The failing areas relationship should be eager loaded

### Actual behavior

An SQL error is raised because the join in the scope is not included in the query.
This is a variant of the bug fixed by 91e3dab804fffe0b1daebb438091418faa1fa256.

### System configuration
**ActiveRecord version**:  5.0.2

**Ruby version**: 2.3.0p0

