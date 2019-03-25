---
title: ActiveRecord's `.where.not()` improperly negates polymorphic associations
labels: With reproduction steps, activerecord, attached PR
layout: issue
---

Example: https://gist.github.com/pvande/90ee91d4f09d0a125da2

ActiveRecord's default behavior around `.where.not(hash)` is to ensure that each key is appropriately filtered out from the query, with the effect being that the query is populated with `(key1 != value1) AND (key2 != value2)`.  In general, this feels like a fair implementation, despite not being a direct negation of `.where(hash)`.

However, ActiveRecord also supports [filtering on a polymorphic association](http://guides.rubyonrails.org/active_record_querying.html#equality-conditions).  This works as expected, internally being expanded to a condition that verifies both the `relation_id` and the `relation_type`.  Negating one of these conditions, however, excludes rows that share a `relation_type` or a `relation_id`.

