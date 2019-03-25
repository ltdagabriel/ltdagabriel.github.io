---
title: ActiveRecord's `.where` cannot handle polymorphic arrays containing different types
labels: With reproduction steps, activerecord
layout: issue
---

Example: https://gist.github.com/pvande/2e346213ace076cd0edb

ActiveRecord supports [filtering on a polymorphic association](http://guides.rubyonrails.org/active_record_querying.html#equality-conditions), including filtering on an array of related objects, permitting users to write queries like this:

``` ruby
PriceEstimate.where(estimate_of: [treasure1, treasure2]).count
```

This generally works pretty well, generating an SQL query like this:

``` sql
SELECT COUNT(*)
FROM "price_estimates"
WHERE (
  "price_estimates"."estimate_of_type" = 'Treasure' AND
  "price_estimates"."estimate_of_id" IN (1, 2)
)
```

When attempting such a query with multiple related types however, the query breaks down.

``` ruby
# Both Parrot and Pirate are valid polymorphic types for Treasure
parrot, pirate = Parrot.find(1), Pirate.find(1)
Treasure.where(looter: [parrot, pirate]).count
```

``` sql
SELECT COUNT(*)
FROM "treasures"
WHERE (
  "treasures"."looter_type" = 'Parrot' AND
  "treasures"."looter_id" IN (1, 1)
)
```

The expected result for the above query would include all Treasure looted by either `Parrot#1` or `Pirate#1`.

