---
title: ActiveRecord PostgreSQL Range types transform differently on find_by and find_or_create_by
labels: activerecord
layout: issue
---

### Steps to reproduce

Schema:

```ruby
  create_table "zipcodes", force: :cascade, comment: "information about zipcodes" do |t|
    t.int4range "zip", null: false
  end
```

Try querying for an existing Zipcode using `find_by`:

```ruby
[10] pry(main)> Zipcode.find_by(zip: 91700...91900)

  Zipcode Load (0.4ms)  SELECT  "zipcodes".* FROM "zipcodes" WHERE "zipcodes"."zip" = $1 LIMIT $2  [["zip", "[91700,91900)"], ["LIMIT", 1]]
=> #<Zipcode:0x007fed42719148
 id: 1,
 zip: 91700...91900,
 created_at: Thu, 01 Dec 2016 18:56:15 UTC +00:00,
 updated_at: Thu, 01 Dec 2016 18:56:15 UTC +00:00>
```

Now try the same thing with `find_or_create_by`:

```ruby
[11] pry(main)> Zipcode.find_or_create_by(zip: 91700...91900)

  Zipcode Load (6.3ms)  SELECT  "zipcodes".* FROM "zipcodes" WHERE ("zipcodes"."zip" >= $1 AND "zipcodes"."zip" < $2) LIMIT $3  [["zip", 91700], ["zip", 91900], ["LIMIT", 1]]
ActiveRecord::StatementInvalid: PG::InvalidTextRepresentation: ERROR:  malformed range literal: "91700"
DETAIL:  Missing left parenthesis or bracket.
: SELECT  "zipcodes".* FROM "zipcodes" WHERE ("zipcodes"."zip" >= $1 AND "zipcodes"."zip" < $2) LIMIT $3
from /Users/bgentry/.rbenv/versions/2.3.3/lib/ruby/gems/2.3.0/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/postgresql_adapter.rb:606:in `exec_prepared'
```

### Expected behavior

Both `find_by` and `find_or_create_by` should transform the Ruby Range into a Postgres range in the same way.

### Actual behavior

If we compare the generated SQL, we can see that the zip value is transformed differently between the two cases:

```sql
-- working find_by
SELECT  "zipcodes".* FROM "zipcodes" WHERE "zipcodes"."zip" = $1 LIMIT $2  [["zip", "[91700,91900)"], ["LIMIT", 1]]
-- broken find_or_create_by
SELECT  "zipcodes".* FROM "zipcodes" WHERE ("zipcodes"."zip" >= $1 AND "zipcodes"."zip" < $2) LIMIT $3  [["zip", 91700], ["zip", 91900], ["LIMIT", 1]]
```

Specifically, the `find_or_create_by` transformation is broken and seems to be trying to query as though the `zip` column was a single int and then find results where int is within the provided Range. Looks like it's not triggering the postgres range support at all for some reason.

### System configuration
**Rails version**: 5.0.0.1

**Ruby version**: 2.3.3

