---
title: mark_for_destruction order of execution not honored
labels: activerecord
layout: issue
---

In my app, I rely on mark_for_destruction removing records before adding new ones due to a unique index on the table. Starting with 3.2.7, the order of execution is not honored.

This commit looks to be the culprit: https://github.com/rails/rails/commit/b1e509ad7a8c8264544f10f4666705cd806b5408?w=0

``` ruby
#replace fees
reservation.reservation_fees.each(&:mark_for_destruction)
rate[:fees].each { |fee| reservation.reservation_fees.build(fee) }
```

3.2.6

```
  SQL (0.5ms)  DELETE FROM "reservation_fees" WHERE "reservation_fees"."id" = $1  [["id", 49944]]
  SQL (0.1ms)  DELETE FROM "reservation_fees" WHERE "reservation_fees"."id" = $1  [["id", 49943]]
  SQL (0.1ms)  DELETE FROM "reservation_fees" WHERE "reservation_fees"."id" = $1  [["id", 49942]]
  SQL (0.1ms)  DELETE FROM "reservation_fees" WHERE "reservation_fees"."id" = $1  [["id", 49941]]
  SQL (0.1ms)  DELETE FROM "reservation_fees" WHERE "reservation_fees"."id" = $1  [["id", 49940]]
  SQL (1.8ms)  INSERT INTO "reservation_fees" ("amount", "code", "created_at", "name", "pricing", "quantity", "rate", "reservation_id", "updated_at") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING "id"  [["amount", #<BigDecimal:7fbc440cd480,'0.1E1',9(18)>], ["code", "SHTLFE"], ["created_at", Mon, 13 Aug 2012 17:36:33 EDT -04:00], ["name", "Airport Shuttle Permit Fee 1.00 FLAT"], ["pricing", "flat"], ["quantity", 1], ["rate", #<BigDecimal:7fbc440cd570,'0.1E1',9(18)>], ["reservation_id", 11000010], ["updated_at", Mon, 13 Aug 2012 17:36:33 EDT -04:00]]
  SQL (1.1ms)  INSERT INTO "reservation_fees" ("amount", "code", "created_at", "name", "pricing", "quantity", "rate", "reservation_id", "updated_at") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING "id"  [["amount", #<BigDecimal:7fbc440e3820,'0.41E1',18(18)>], ["code", "STCHG"], ["created_at", Mon, 13 Aug 2012 17:36:33 EDT -04:00], ["name", "State Surcharge 2.05 PER DAY"], ["pricing", "per day"], ["quantity", 2], ["rate", #<BigDecimal:7fbc440e38c0,'0.205E1',18(18)>], ["reservation_id", 11000010], ["updated_at", Mon, 13 Aug 2012 17:36:33 EDT -04:00]]
  SQL (1.1ms)  INSERT INTO "reservation_fees" ("amount", "code", "created_at", "name", "pricing", "quantity", "rate", "reservation_id", "updated_at") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING "id"  [["amount", #<BigDecimal:7fbc440ef558,'0.25E1',18(18)>], ["code", "RCVR"], ["created_at", Mon, 13 Aug 2012 17:36:33 EDT -04:00], ["name", "License Recovery Fee 1.25 PER DAY"], ["pricing", "per day"], ["quantity", 2], ["rate", #<BigDecimal:7fbc440ef620,'0.125E1',18(18)>], ["reservation_id", 11000010], ["updated_at", Mon, 13 Aug 2012 17:36:33 EDT -04:00]]
  SQL (1.0ms)  INSERT INTO "reservation_fees" ("amount", "code", "created_at", "name", "pricing", "quantity", "rate", "reservation_id", "updated_at") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING "id"  [["amount", #<BigDecimal:7fbc448c90a8,'0.328E1',18(18)>], ["code", "APTFEE"], ["created_at", Mon, 13 Aug 2012 17:36:33 EDT -04:00], ["name", "Airport Access/Imposed Fee 9.29%"], ["pricing", "percent"], ["quantity", 1], ["rate", #<BigDecimal:7fbc448c91c0,'0.929E1',18(18)>], ["reservation_id", 11000010], ["updated_at", Mon, 13 Aug 2012 17:36:33 EDT -04:00]]
  SQL (1.0ms)  INSERT INTO "reservation_fees" ("amount", "code", "created_at", "name", "pricing", "quantity", "rate", "reservation_id", "updated_at") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING "id"  [["amount", #<BigDecimal:7fbc448dd238,'0.299E1',18(18)>], ["code", "STETAX"], ["created_at", Mon, 13 Aug 2012 17:36:33 EDT -04:00], ["name", "State Sales Tax 7.00%"], ["pricing", "percent"], ["quantity", 1], ["rate", #<BigDecimal:7fbc448dd2d8,'0.7E1',9(18)>], ["reservation_id", 11000010], ["updated_at", Mon, 13 Aug 2012 17:36:33 EDT -04:00]]
   (1.9ms)  COMMIT
```

3.2.7 & 3.2.8

```
  SQL (3.1ms)  INSERT INTO "reservation_fees" ("amount", "code", "created_at", "name", "pricing", "quantity", "rate", "reservation_id", "updated_at") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING "id"  [["amount", #<BigDecimal:7f90d1a11ad0,'0.1E1',9(18)>], ["code", "SHTLFE"], ["created_at", Mon, 13 Aug 2012 17:26:10 EDT -04:00], ["name", "Airport Shuttle Permit Fee 1.00 FLAT"], ["pricing", "flat"], ["quantity", 1], ["rate", #<BigDecimal:7f90d1a14410,'0.1E1',9(18)>], ["reservation_id", 11000010], ["updated_at", Mon, 13 Aug 2012 17:26:10 EDT -04:00]]
PG::Error: ERROR:  duplicate key value violates unique constraint "index_reservation_fees_on_reservation_id_and_code"
DETAIL:  Key (reservation_id, code)=(11000010, SHTLFE) already exists.
: INSERT INTO "reservation_fees" ("amount", "code", "created_at", "name", "pricing", "quantity", "rate", "reservation_id", "updated_at") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING "id"
   (0.1ms)  ROLLBACK
```

