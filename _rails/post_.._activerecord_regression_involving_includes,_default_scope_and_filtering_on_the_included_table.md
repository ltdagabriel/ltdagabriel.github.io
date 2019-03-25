---
title: post 4.0.0 activerecord regression involving includes, default_scope and filtering on the included table
labels: activerecord, attached PR
layout: issue
---

problem commit: https://github.com/rails/rails/commit/b407839601c8dc7b007a6baddea3696b737c352b
test: https://gist.github.com/bughit/6092803

good sql (previous commit):

``` sql
SELECT "items"."id" AS t0_r0, "items"."type" AS t0_r1, "items"."some_data" AS t0_r2, "comments_items"."id" AS t1_r0, "comments_items"."type" AS t1_r1, "comments_items"."some_data" AS t1_r2
FROM "items" 
LEFT OUTER JOIN "comments_posts" ON "comments_posts"."post_id" = "items"."id"
LEFT OUTER JOIN "items" "comments_items" ON "comments_items"."id" = "comments_posts"."comment_id" AND "comments_items"."type" IN ('Comment') 
WHERE "items"."type" IN ('Post') AND (comments_items.some_data = 1)
```

bad sql:

``` sql
SELECT "items"."id" AS t0_r0, "items"."type" AS t0_r1, "items"."some_data" AS t0_r2, "comments_items"."id" AS t1_r0, "comments_items"."type" AS t1_r1, "comments_items"."some_data" AS t1_r2
FROM "items"
LEFT OUTER JOIN "comments_posts" ON "comments_posts"."post_id" = "items"."id" 
LEFT OUTER JOIN "items" "comments_items" ON "comments_items"."id" = "comments_posts"."comment_id" AND "comments_items"."type" IN ('Comment') AND "items"."type" IN ('Comment')
WHERE "items"."type" IN ('Post') AND (comments_items.some_data = 1)
```

The problem is the nonsensical `"items"."type" IN ('Comment')` inserted into the join condition of the second join.  

@jonleighton

