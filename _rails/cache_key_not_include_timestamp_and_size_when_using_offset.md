---
title: cache_key not include timestamp and size when using offset
labels: With reproduction steps, activerecord, attached PR
layout: issue
---

### Steps to reproduce

When we use offset in query cache_key is not calculated correctly
Here is gist
https://gist.github.com/madmax/e796a740386d1b25516449b5d19b4fd8

without offset: posts/query-322bc402789ebcd22fbdb7b4ea9dec2f-10-20160621080044729910
with offset: posts/query-88260ab1dd3cd2484198b0102cbbc25f-0
### Expected behavior

cache_key should include size and timestamp even if we use offset in other case cache will not expire.
### Actual behavior

Currenlty because we are doing 
SELECT  COUNT(*) AS "size", MAX("posts"."updated_at") AS timestamp FROM "posts" LIMIT ? OFFSET ?  [["LIMIT", 5], ["OFFSET", 5]]

There is no record returned and cache key don't include size + timestamp information. 
### System configuration

**Rails version**: master (5.0 also affected)

**Ruby version**: 2.3.0

