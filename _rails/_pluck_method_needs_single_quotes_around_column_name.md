---
title: :pluck method needs single quotes around column name
labels: activerecord
layout: issue
---

Suppose there is a model named Students, with a column_name = "first_name"

Then, `Student.pluck(:first_name)` produces a query:

``` sql
SELECT first_name FROM 'students' 
```

Notice that lacking of single quotes around "first_name". The query should instead be:

``` sql
SELECT 'first_name' FROM 'students'
```

Thank you.

