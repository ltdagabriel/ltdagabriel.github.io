---
title: No bind parameters used for Limit and Offset
labels: activerecord
layout: issue
---

I was looking through a production heap dump and found a ton of these strings:

```
"\"$user\",public-SELECT \"issues\".* FROM \"issues\" WHERE \"issues\".\"repo_id\" = $1 AND \"issues\".\"state\" = $2 ORDER BY created_at DESC LIMIT 20 OFFSET 540"
```

It looks like they're being retained by the prepared statement cache. I'm using `will_paginate` to set offset and limit, and it looks like for every query with a new page, there is a new query generated. This will quickly consume the whole prepared statement cache which is less than ideal, see https://github.com/rails/rails/issues/21992 for examples as to why. 

@pixeltrix pointed out this line in AR https://github.com/rails/arel/blob/master/lib/arel/visitors/to_sql.rb#L419-L422 showing where we concat the number. 

We could also get some minor savings by constantizing more sql strings similar to this list https://github.com/rails/arel/blob/3c429c5d86e9e2201c2a35d934ca6a8911c18e69/lib/arel/visitors/to_sql.rb#L51-L57

