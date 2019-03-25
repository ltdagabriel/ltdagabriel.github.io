---
title: Bug when calling has_many :through on STI models with the same parent class
labels: activerecord, attached PR
layout: issue
---

Hey guys ... I came across this bug a few days ago.

When calling a has many through relationship through models that share the same table name (through single table inheritance), the SQL that's produced is incorrect. It's returning an empty set instead of the records expected.

Here's the code to recreate the error.

``` ruby
require 'active_record'

ActiveRecord::Base.establish_connection 'sqlite3:///:memory:'

ActiveRecord::Base.connection.instance_eval do

  create_table "places", force: true do |t|
    t.string   "name"
    t.string   "type"
    t.integer  "parent_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "places", ["parent_id"], name: "index_places_on_parent_id"

end

# This is the parent class for each model defined below
# - Place
# | - Country
# | - City
# | - District
class Place < ActiveRecord::Base
  belongs_to :parent
end

class Country < Place

  has_many :cities, foreign_key: 'parent_id'

  has_many :districts, through: :cities, foreign_key: 'parent_id'
end

class City < Place

  belongs_to :country, foreign_key: 'parent_id'

  has_many :districts, foreign_key: 'parent_id'
end

class District < Place

  belongs_to :city, foreign_key: "parent_id"

end

# Create a bunch of records
country  = Country.create! name: "USA"
city     = country.cities.create! name: "Seattle"
district = city.districts.create! name: "Capitol Hill"

# I would expect these to be equal - they're not.
puts Country.first.cities.map(&:districts)
puts Country.first.districts
# This should be true
puts Country.first.cities.map(&:districts).flatten == Country.first.districts # => false
```

@tenderlove seems to agree that it's a Rails bug.

