---
title: PostgreSQL array support broken for timestamps 
labels: PostgreSQL, activerecord
layout: issue
---

The activerecord changelog says that any datatype can be used to create an array column, but it seems to not work for timestamps:

Here is my migration:

```
create_table :sql_arrays do |t|
  t.timestamp :timestamps, array: true, default: []
  t.date :dates, array: true, default: []
  t.timestamps
end
```

And then creating a new entry in the console:

```
2.0.0p353 :006 > SqlArray.create(timestamps: [Time.now], dates: [Date.today])
D, [2013-12-19T12:39:57.855962 #6283] DEBUG -- :    (3.9ms)  BEGIN
D, [2013-12-19T12:39:57.859231 #6283] DEBUG -- :   SQL (2.6ms)  INSERT INTO "sql_arrays" ("created_at", "dates", "timestamps", "updated_at") VALUES ($1, $2, $3, $4) RETURNING "id"  [["created_at", Thu, 19 Dec 2013 11:39:57 UTC +00:00], ["dates", [Thu, 19 Dec 2013]], ["timestamps", nil], ["updated_at", Thu, 19 Dec 2013 11:39:57 UTC +00:00]]
D, [2013-12-19T12:39:57.875126 #6283] DEBUG -- :    (15.7ms)  COMMIT
+----+------------+------------+-------------------------+-------------------------+
| id | timestamps | dates      | created_at              | updated_at              |
+----+------------+------------+-------------------------+-------------------------+
| 3  |            | 2013-12-19 | 2013-12-19 11:39:57 UTC | 2013-12-19 11:39:57 UTC |
+----+------------+------------+-------------------------+-------------------------+
1 row in set
```

As you see the timestamps array value gets submitted as `nil`. I'm using the latest stable version of rails (4.0.2)

