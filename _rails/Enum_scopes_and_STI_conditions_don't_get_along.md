---
title: Enum scopes and STI conditions don't get along
labels: activerecord, regression
layout: issue
---

This is a regression on master, from 4.2.

https://gist.github.com/claudiob/ae3452eaa3cf6307453a
- I have an `Activity` class with a `status` enum which can be `pending`, `failed` or `successful`
- `Activity` has two subclasses: `Snapshot` and `Adjustment`
- First I create a successful Adjustment
- Then I create a successful Snapshot
- Then I query for the first successful Snapshot, and I expect to get a `Snapshot` object, but instead I get an `Adjustment` object

I haven't tracked down the case yet but I believe it's related to #22426.
In fact, the SQL that runs for `Snapshot.successful.first` is different:

```
# Snapshot.successful.first # in Rails 4.2
SELECT  "activities".* FROM "activities" WHERE "activities"."type" IN ('Snapshot') AND "activities"."status" = ?  ORDER BY "activities"."id" ASC LIMIT 1  [["status", 2]]

# Snapshot.successful.first # in Rails 5.0.0.beta1
SELECT  "activities".* FROM "activities" WHERE "activities"."status" = ? ORDER BY "activities"."id" ASC LIMIT ?  [["status", 2], ["LIMIT", 1]]
```

Applying the version of rails/rails patched by #22426 does not seem to fix the issue.

