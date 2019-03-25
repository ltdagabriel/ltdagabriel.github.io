---
title: has_many :through with a Polymorphic association seems broken.
labels: activerecord, stale
layout: issue
---

I'm having an issue with using a has_many through with a polymorphic association. It appears the query building is broken. I've created a gist with the relevant code, and included the primary description in this ticket: https://gist.github.com/codezomb/717dc6eeddea5d0df688

The version of rails, is 4.0.0.

You can see here that calling `i.first.plans` gives me a valid plan object. However, calling `i.first.items` afterwards returns an empty collection.

```
2.0.0-p247 :048 > i = InventoryRequest.first
  InventoryRequest Load (0.1ms)  SELECT "inventory_requests".* FROM "inventory_requests" ORDER BY "inventory_requests"."id" ASC LIMIT 1
+----+----------+-------------------------+-------------------------+--------------+
| id | order_id | created_at              | updated_at              | warehouse_id |
+----+----------+-------------------------+-------------------------+--------------+
| 1  | 1        | 2013-08-23 18:07:30 UTC | 2013-08-23 18:07:30 UTC | 1            |
+----+----------+-------------------------+-------------------------+--------------+
```

```
2.0.0-p247 :042 > i.plans
  InventoryRequest Load (0.1ms)  SELECT "inventory_requests".* FROM "inventory_requests" ORDER BY "inventory_requests"."id" ASC LIMIT 1
  Plan Load (0.1ms)  SELECT "plans".* FROM "plans" INNER JOIN "order_items" ON "plans"."id" = "order_items"."orderable_id" INNER JOIN "orders" ON "order_items"."order_id" = "orders"."id" WHERE "order_items"."orderable_type" = 'Plan' AND "orders"."id" = ?  [["id", 1]]
+----+-------------+---------+-------+------+-----------+-----------------+---------------+-------------------------+-------------------------+
| id | part_number | name    | price | cost | plan_type | expiration_days | carrier_id_id | created_at              | updated_at              |
+----+-------------+---------+-------+------+-----------+-----------------+---------------+-------------------------+-------------------------+
| 3  | 2460356545  | Plan #3 |       |      |           |                 |               | 2013-08-23 18:06:14 UTC | 2013-08-23 18:06:14 UTC |
+----+-------------+---------+-------+------+-----------+-----------------+---------------+-------------------------+-------------------------+
```

```
2.0.0-p247 :043 > i.first.items
  InventoryRequest Load (0.2ms)  SELECT "inventory_requests".* FROM "inventory_requests" ORDER BY "inventory_requests"."id" ASC LIMIT 1
  Item Load (0.1ms)  SELECT "items".* FROM "items" INNER JOIN "order_items" ON "items"."id" = "order_items"."orderable_id" INNER JOIN "orders" ON "order_items"."order_id" = "orders"."id" WHERE "order_items"."orderable_type" = 'Plan' AND "order_items"."orderable_type" = 'Item' AND "orders"."id" = ?  [["id", 1]]
 => #<ActiveRecord::Associations::CollectionProxy []>
```

 You can see that the query is looking for both source_types at once:

```
 WHERE "order_items"."orderable_type" = 'Plan' AND "order_items"."orderable_type" = 'Item'
```

I can reload the console, reverse the call order, and get a similar result. This time `i.first.items` returns correctly, and `i.first.plans` returns the empty collection.

```
 2.0.0-p247 :049 > reload!
Reloading...
 => true

2.0.0-p247 :048 > i = InventoryRequest.first
  InventoryRequest Load (0.1ms)  SELECT "inventory_requests".* FROM "inventory_requests" ORDER BY "inventory_requests"."id" ASC LIMIT 1
+----+----------+-------------------------+-------------------------+--------------+
| id | order_id | created_at              | updated_at              | warehouse_id |
+----+----------+-------------------------+-------------------------+--------------+
| 1  | 1        | 2013-08-23 18:07:30 UTC | 2013-08-23 18:07:30 UTC | 1            |
+----+----------+-------------------------+-------------------------+--------------+
```

```
 2.0.0-p247 :045 > i.first.items
  InventoryRequest Load (0.1ms)  SELECT "inventory_requests".* FROM "inventory_requests" ORDER BY "inventory_requests"."id" ASC LIMIT 1
  Item Load (0.2ms)  SELECT "items".* FROM "items" INNER JOIN "order_items" ON "items"."id" = "order_items"."orderable_id" INNER JOIN "orders" ON "order_items"."order_id" = "orders"."id" WHERE "order_items"."orderable_type" = 'Item' AND "orders"."id" = ?  [["id", 1]]
+----+-------------+---------+-------+------+-------------------------+-------------------------+
| id | part_number | name    | price | cost | created_at              | updated_at              |
+----+-------------+---------+-------+------+-------------------------+-------------------------+
| 8  | 9451781167  | Item #8 |       |      | 2013-08-23 18:04:58 UTC | 2013-08-23 18:04:58 UTC |
+----+-------------+---------+-------+------+-------------------------+-------------------------+
```

```
 2.0.0-p247 :046 > i.first.plans
  InventoryRequest Load (0.2ms)  SELECT "inventory_requests".* FROM "inventory_requests" ORDER BY "inventory_requests"."id" ASC LIMIT 1
  Plan Load (0.1ms)  SELECT "plans".* FROM "plans" INNER JOIN "order_items" ON "plans"."id" = "order_items"."orderable_id" INNER JOIN "orders" ON "order_items"."order_id" = "orders"."id" WHERE "order_items"."orderable_type" = 'Item' AND "order_items"."orderable_type" = 'Plan' AND "orders"."id" = ?  [["id", 1]]
 => #<ActiveRecord::Associations::CollectionProxy []>
```

