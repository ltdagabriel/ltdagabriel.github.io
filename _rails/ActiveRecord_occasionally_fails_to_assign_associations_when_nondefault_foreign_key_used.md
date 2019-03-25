---
title: ActiveRecord occasionally fails to assign associations when non-default foreign_key used
labels: activerecord
layout: issue
---

Somehow it using correct key only once...

```
SQLite3::SQLException: no such column: cities.code:
UPDATE "cities" SET "state_code" = NULL WHERE
"cities"."state_code" = 'W' AND
"cities"."code" IS NULL
```

Not sure why it is attaching `"cities"."code" IS NULL`

It happens only when state already has some cities attached and
i'm trying to set new cities using `#cities=`

Here is how to repeat:

``` ruby
require 'logger'
require 'active_record'

ActiveRecord::Base.logger = Logger.new(STDERR)
ActiveRecord::Base.establish_connection(
  adapter:  "sqlite3",
  database: ":memory:"
)

ActiveRecord::Schema.define do
  create_table :states do |table|
    table.column :name, :string
    table.column :code, :string
  end
  add_index :states, :code

  create_table :cities do |table|
    table.column :name, :string
    table.column :state_code, :string
  end
  add_index :cities, :state_code
end

class State < ActiveRecord::Base
  has_many :cities, foreign_key: :state_code, primary_key: :code
end

class City < ActiveRecord::Base
  belongs_to :state, foreign_key: :state_code, primary_key: :code
end

states = (1..10).to_a.inject([]) do |s,n|
  s << State.create(name: n.to_s, code: ('A'..'Z').to_a.sample)
end

cities = (1..10).to_a.inject([]) do |c,n|
   c << City.create(name: n.to_s, state: states.sample)
end

state, state_cities = states.sample, cities.sample(5)
state_cities_n = state.cities.size
p state, state_cities
begin
  state.cities = state_cities
rescue => e
  puts '', '===', e.message, '===', ''
end
state.save!
state.reload
p [state_cities_n, state.cities.size]
```

