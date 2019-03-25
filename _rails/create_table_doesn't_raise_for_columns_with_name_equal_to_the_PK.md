---
title: #create_table doesn't raise for columns with name equal to the PK
labels: activerecord
layout: issue
---

The following will create an integer PK with name slug and ignore the column definition:

``` ruby
create_table :posts, primary_key: :slug do |t|
  t.string :slug
  # ...
end
```

Probably it should pick the column type from the column definition or fail completely.

