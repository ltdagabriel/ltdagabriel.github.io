---
title: has many through with non-lambda scope goes silently awry under activerecord 4.0.0.rc1
labels: activerecord
layout: issue
---

In this gist: https://gist.github.com/seanwalbran/5501979
the query resulting from combining the has-many-through relationship with the named scopes behaves very differently depending on whether the scope is a lamba or not, as of 4.0.0.rc1:

```
I, [2013-05-02T07:52:37.973373 #55506]  INFO -- : with lambda
D, [2013-05-02T07:52:37.975057 #55506] DEBUG -- :    (0.1ms)  SELECT COUNT(*) FROM "users" INNER JOIN "user_mentions" ON "users"."id" = "user_mentions"."user_id" WHERE "user_mentions"."post_id" = ? AND "users"."admin" = 't'  [["post_id", 1]]
I, [2013-05-02T07:52:37.975166 #55506]  INFO -- : without lambda
D, [2013-05-02T07:52:37.976599 #55506] DEBUG -- :    (0.1ms)  SELECT COUNT(*) FROM "users" WHERE "users"."admin" = 't'
```

Note the complete absence of the join in the second query; up through 4.0.0.beta1, both queries were identical.

While I understand that the migration guide states that "Rails 4.0 requires that scopes use a callable object such as a Proc or lambda", the implementation only communicates that "Using #scope without passing a callable object is deprecated."  The above behavior difference is sufficiently broken to be inconsistent with 'deprecation'.

