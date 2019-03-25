---
title: [ActiveRecord] `includes` ignored when using `update_all`
labels: activerecord, needs work
layout: issue
---

### Steps to reproduce

```ruby
Sitter.includes(:bookings).where(bookings: { id: nil }).update_all(status_id: 1)
```

### Expected behavior

```sql
UPDATE "sitters" SET "status_id" = 1 WHERE (id in (SELECT "sitters"."id" FROM "sitters" LEFT OUTER JOIN "bookings" ON "bookings"."sitter_id" = "sitters"."id" WHERE "bookings"."id" IS NULL))
```

```
# minus all the extra fields
PLUCK_IDS_QUERY = Sitter.includes(:bookings).where(bookings: { id: nil }).select(:id).to_sql

Sitter.where("id in (#{PLUCK_IDS_QUERY})").update_all(status_id: 1)
```

### Actual behavior

Fails with:

```sql
UPDATE "sitters" SET "status_id" = 1 WHERE "bookings"."id" IS NULL
```

### System configuration

- **Rails version**: `Rails 5.0.2`
- **Ruby version**: `ruby 2.4.1p111 (2017-03-22 revision 58053) [x86_64-darwin16]`

