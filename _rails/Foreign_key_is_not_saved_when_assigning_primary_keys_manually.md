---
title: Foreign key is not saved when assigning primary keys manually
labels: activerecord
layout: issue
---

The title says it all. This issue came up in an [issue in factory_girl](https://github.com/thoughtbot/factory_girl/issues/561).

``` ruby
# Activate the gem you are reporting the issue against.
gem "activerecord", "3.2.14"
require "active_record"
require "minitest/autorun"
require "logger"

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: "sqlite3", database: ":memory:")
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :cars do |t|
  end

  create_table :horns do |t|
    t.integer :car_id
  end
end

class Car < ActiveRecord::Base
  has_one :horn
end

class Horn < ActiveRecord::Base
  belongs_to :car
end

class BugTest < MiniTest::Unit::TestCase
  def test_association_stuff
    car = Car.new
    car.id = 5

    horn = Horn.new
    horn.id = 10
    horn.save!

    car.horn = horn
    car.save!
    car.reload

    assert car.horn != nil
  end
end
```

