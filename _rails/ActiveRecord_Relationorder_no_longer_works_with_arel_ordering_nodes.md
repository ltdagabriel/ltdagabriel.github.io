---
title: ActiveRecord::Relation#order no longer works with arel ordering nodes
labels: activerecord, regression
layout: issue
---

Initially reported in #1272:

This has introduced a new problem:

```
>> Fuu.order(Fuu.arel_table[:name].desc).reverse_order.to_sql
=> "SELECT \"fuus\".* FROM \"fuus\"  ORDER BY #<Arel::Nodes::Ordering:0x0000010319dc88> DESC"
```

Versus:

```
>> Fuu.order(Fuu.arel_table[:name].desc.to_sql).reverse_order.to_sql
=> "SELECT \"fuus\".* FROM \"fuus\"  ORDER BY \"fuus\".\"name\" ASC"
```

Notice the to_sql call in Fuu.arel_table[:name].desc

