---
title: `scope` and `enum` should raise an error if the generated methods conflict with an existing one
labels: activerecord, enum
layout: issue
---

It should cover these four categories:

Case 1 (class method conflicts):

``` ruby
class Lol < ActiveRecord::Base
  enum state_a: [:new]
end

>> Lol.new
  Lol Load (1.1ms)  SELECT "lols".* FROM "lols"  WHERE "lols"."state_a" = 0
```

Case 2 (conflict between enums):

``` ruby
class Model < ActiveRecord::Base
  enum state_a: [:conflict, :something]
  enum state_b: [:conflict, :else]
end
```

Case 3 (conflict with AR methods):

``` ruby
class Lol < ActiveRecord::Base
  enum state_a: [:valid]
end

>> Lol.new.save!
   (0.1ms)  begin transaction
   (0.0ms)  rollback transaction
ArgumentError: wrong number of arguments (1 for 0)
```

Case 4 (dynamic AR methods):

``` ruby
>> o = Order.first
  Order Load (0.2ms)  SELECT  "orders".* FROM "orders"   ORDER BY "orders"."id" ASC LIMIT 1
=> #<Order id: 1, shipping_address: nil, state: nil, created_at: "2013-12-19 00:14:45", updated_at: "2013-12-19 00:14:45">
>> o.shipping_address = "123 Some St"
=> "123 Some St"
>> o.shipping_address_changed?
=> false
```

As part of this, this should be disallowed as well:

``` ruby
class Model < ActiveRecord::Base
  scope :new, ->{ .... }
  scope :allocate, ->{ ... }
  scope :all, ->{ ... }
  scope :none, -> { ... }

  ...
end
```

