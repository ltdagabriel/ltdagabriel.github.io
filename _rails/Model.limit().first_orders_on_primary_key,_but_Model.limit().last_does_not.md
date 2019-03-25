---
title: Model.limit(1).first orders on primary key, but Model.limit(1).last does not
labels: activerecord, attached PR
layout: issue
---

I noticed today that in some ways the ActiveRecord methods`first` and `last` are not fully symmetrical.

For instance, on their own they produce parallel queries:

```
Unit.first
  > SELECT  "units".* FROM "units" ORDER BY "units"."id" ASC LIMIT $1  [["LIMIT", 1]]

Unit.last
  > SELECT  "units".* FROM "units" ORDER BY "units"."id" DESC LIMIT $1  [["LIMIT", 1]]
```

But chain a `limit` relation, and they no longer behave the same:

```
Unit.limit(1).first
  > SELECT  "units".* FROM "units" ORDER BY "units"."id" ASC LIMIT $1  [["LIMIT", 1]]

Unit.limit(1).last
  > SELECT  "units".* FROM "units" LIMIT $1  [["LIMIT", 1]]
```

This results in the fact that:
`Unit.limit(1).first == Unit.first`
but:
`Unit.limit(1).last != Unit.last`.

