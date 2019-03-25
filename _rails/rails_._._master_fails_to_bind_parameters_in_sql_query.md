---
title: rails 4.0/4.1/master fails to bind parameters in sql query
labels: With reproduction steps, activerecord
layout: issue
---

Error:

<pre>
ActiveRecord::StatementInvalid: PG::ProtocolViolation: ERROR:  bind message supplies 0 parameters, but prepared statement "" requires 1
: SELECT "posts"."id" AS t0_r0, "comments"."id" AS t1_r0, "comments"."post_id" AS t1_r1, "comments"."user_id" AS t1_r2 FROM "posts" LEFT OUTER JOIN "comments" ON "comments"."post_id" = "posts"."id" WHERE "comments"."user_id" IN (SELECT "users"."id" FROM "users" WHERE "users"."company_id" = $1)
</pre>


failing test - https://gist.github.com/slbug/a1fa6c7069c90bb8c7ae

P.S. works well in 3.2.19, but generates different query (without subquery)

