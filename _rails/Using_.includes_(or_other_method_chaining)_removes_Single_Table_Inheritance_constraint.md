---
title: Using `.includes` (or other method chaining) removes Single Table Inheritance constraint
labels: activerecord, attached PR
layout: issue
---

When using STI in ActiveRecord 4, a superclass can declare a method that finds only a certain subclass. This normally works, but fails when `.includes` is used on the superclass before calling the method.

For example, the superclass `Automobile` declares a method that finds an instance of its `Truck` subclass:

``` ruby
class Automobile < ActiveRecord::Base
  has_many :tires
  def self.find_truck(id)
    Truck.find_by_id(id)
  end
end

class Truck < Automobile
end

class Tire < ActiveRecord::Base
end
```

For normal queries, calling `Automobile.find_truck(1)` generates SQL that constrains the `type` to `"Truck"`:

``` sql
SELECT  "automobiles".* FROM "automobiles"  WHERE "automobiles"."type" IN ('Truck') AND "automobiles"."id" = 1 LIMIT 1
```

But when an `includes()` is added, the type constraint is dropped:

``` ruby
Automobile.includes(:tires).find_truck(1)
```

``` sql
SELECT  "automobiles".* FROM "automobiles"  WHERE "automobiles"."id" = 1 LIMIT 1
```

In ActiveRecord 3, the type constraint is not dropped when using `includes()`.

A test case reproing the issue is available [as a gist](https://gist.github.com/MaxGabriel/8a73aece95d1c595811f).

Edit: This appears to happen when using any chaining method, not just `includes()`. For example, `Automobile.where(:make => "Toyota").find_truck(1)` generates the following SQL:

``` sql
SELECT  "automobiles".* FROM "automobiles"  WHERE "automobiles"."make" = 'Toyota' AND "automobiles"."id" = 1 LIMIT 1
```

