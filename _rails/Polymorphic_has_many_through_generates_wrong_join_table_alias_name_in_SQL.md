---
title: Polymorphic has_many through generates wrong join table alias name in SQL
labels: With reproduction steps, activerecord
layout: issue
---

I've wrote a minimal [test script](https://gist.github.com/manno/ffd48e0302a9ad51162e) to demonstrate the issue.

While the first two asserts succeed, the third assert fails.
The chained scopes on the has_many through relations with a polymorphic source fail to retrieve any record.

I'd expect the third inner join to check `"bookings_users_join"."bookable_type"` instead 
of `"bookings"."bookable_type"`.

```
SELECT COUNT(*) FROM "users" INNER JOIN "bookings" ON "bookings"."user_id" = "users"."id" AND "bookings"."bookable_type" = ? INNER JOIN "orders" ON "orders"."id" = "bookings"."bookable_id" INNER JOIN "bookings" "bookings_users_join" ON "bookings_users_join"."user_id" = "users"."id" AND "bookings"."bookable_type" = ? INNER JOIN "deliveries" ON "deliveries"."id" = "bookings_users_join"."bookable_id" WHERE "users"."id" = ? AND "users"."id" = ?  [["bookable_type", "Order"], ["bookable_type", "Delivery"], ["id", 1], ["id", 1]]
```

