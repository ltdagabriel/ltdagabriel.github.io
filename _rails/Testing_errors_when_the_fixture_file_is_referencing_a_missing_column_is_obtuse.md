---
title: Testing errors when the fixture file is referencing a missing column is obtuse
labels: activerecord
layout: issue
---

Here's the error I got from having an extra, since-removed column mentioned in a yml fixture:

```
 30) Error:
RecurrenceScheduleTest#test_every_Friday_morning:
NoMethodError: undefined method `sql_type' for nil:NilClass
```

Ouch. We can do better than that.

