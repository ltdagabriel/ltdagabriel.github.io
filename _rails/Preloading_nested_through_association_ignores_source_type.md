---
title: Preloading nested through association ignores source_type
labels: activerecord, attached PR
layout: issue
---

### Steps to reproduce
```ruby
begin
  require "bundler/inline"
rescue LoadError => e
  $stderr.puts "Bundler version 1.10 or later is required. Please update your Bundler"
  raise e
end

gemfile(true) do
  source "https://rubygems.org"
  gem "rails", github: "rails/rails"
  gem "arel", github: "rails/arel"
  gem "sqlite3"
end

require "active_record"
require "minitest/autorun"
require "logger"

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: "sqlite3", database: ":memory:")
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :hotels, force: true do |t|
  end
  create_table :departments, force: true do |t|
    t.integer :hotel_id
  end
  create_table :cake_designers, force: true do |t|
  end
  create_table :drink_designers, force: true do |t|
  end
  create_table :chefs, force: true do |t|
    t.integer :employable_id
    t.string :employable_type
    t.integer :department_id
    t.string :employable_list_type
    t.integer :employable_list_id
  end
end

class Hotel < ActiveRecord::Base
  has_many :departments
  has_many :chefs, through: :departments
  has_many :cake_designers, source_type: "CakeDesigner", source: :employable, through: :chefs
  has_many :drink_designers, source_type: "DrinkDesigner", source: :employable, through: :chefs
end

class Department < ActiveRecord::Base
  has_many :chefs
  belongs_to :hotel
end

class Chef < ActiveRecord::Base
  belongs_to :employable, polymorphic: true
  has_many :recipes
end

class CakeDesigner < ActiveRecord::Base
  has_one :chef, as: :employable
end

class DrinkDesigner < ActiveRecord::Base
  has_one :chef, as: :employable
end

class BugTest < Minitest::Test
  def test_preloading_polymorphic_source_on_two_level_has_many_through
    hotel = Hotel.create!
    department = hotel.departments.create!
    cake_designer = CakeDesigner.create!
    drink_designer = DrinkDesigner.create!
    department.chefs.create!(employable: cake_designer)
    department.chefs.create!(employable: drink_designer)

    found_cake_designers = Hotel.preload(:cake_designers).find(hotel.id).cake_designers

    assert_equal 1, found_cake_designers.size
    assert_equal cake_designer, found_cake_designers.first
  end
end
```
### Expected behavior
The `found_cake_designers` should have size 1 and only contain the `cake_designer`.

### Actual behavior
The `found_cake_designers` contained the `cake_designer` and the `drink_designer`.

### System configuration
**Rails version**:
`master`, 5.0.3
**Ruby version**:
2.3.1p112
