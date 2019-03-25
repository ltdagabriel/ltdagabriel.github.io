---
title: Zero valued numeric attribute always updated when calling: update_attributes :field => "0.0"
labels: activerecord
layout: issue
---

Create a new rails app with a model that has a float or integer attribute:

```
$> rails new you_dirty_float
...
$> rails g model product price:float
...
$> rake db:migrate
```

When you create a product with price equals to 0.0, it always gets updated every time you call update_attributes with a string equals to "0.0":

``` ruby
> p = Product.create price: 0.0
INSERT INTO "products" ("created_at", "price", "updated_at") VALUES (?, ?, ?) ...

> p.update_attributes :price => "0.0"
  (0.1ms)  begin transaction
  (0.6ms)  UPDATE "products" SET "price" = 0.0, "updated_at" = '2013-01-23 01:18:52.633492' WHERE "products"."id" = 3
  (1.8ms)  commit transaction

> p.update_attribute :price, "0.0"
   (0.1ms)  begin transaction
   (0.6ms)  UPDATE "products" SET "price" = 0.0, "updated_at" = '2013-01-23 01:21:11.611959' WHERE "products"."id" = 3
   (1.4ms)  commit transaction
```

For the below commands, the object is not updated:

``` ruby
> p.update_attributes :price => 0.0
   (0.1ms)  begin transaction
   (0.0ms)  commit transaction

> p.update_attribute :price, 0.0
   (0.1ms)  begin transaction
   (0.0ms)  commit transaction

> p.update_attribute :price, "0"
   (0.1ms)  begin transaction
   (0.0ms)  commit transaction

> p.update_attribute :price, "0.0".to_f
   (0.1ms)  begin transaction
   (0.0ms)  commit transaction
```

This behavior was observed in both Rails 3.2.9 and 3.2.11.

