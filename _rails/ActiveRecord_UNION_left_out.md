---
title: ActiveRecord UNION left out
labels: activerecord
layout: issue
---

_Imported from Lighthouse._ Original ticket at: http://rails.lighthouseapp.com/projects/8994/tickets/6591
Created by **clyfe** - 2011-03-17 19:22:47 UTC

ActiveRecord returns Arel::Nodes::Union when I call model.union(active_relation), but it should return an ActiveRelation
1. What steps will reproduce the problem:
   
   class User << AR::Base; end  
   User.where(:a => 1).union(User.where(:a => 2))  
2. What is the wrong result:
   
   The result is an instance of Arel::Nodes::Union
3. What is the result that should happen instead:
   
   The computation should return an instance of ActiveRelation
### THE GOOD

The resulting Arel::Nodes::Union object can be transformed to_sql and then we can use User.find_by_sql(sql)

```
a = User.where(:a => 1).union(User.where(:a => 2))
sql = a.to_sql # ( SELECT "users".* FROM "users" WHERE "users"."a" = 1 UNION SELECT "users".* FROM "users" WHERE "users"."a" = 2 )"
User.find_by_sql(sql)
```
### THE ISSUE

The issue is obtaining an ActiveRelation object that we can further chain.
Caling a method (select, where, includes) on this (ActiveRelation unioned) object would have the behavior of further calling that method on each of the ActiveRelation objects involved in the UNION

---

All tough in general a UNION query can be avoided, there are some cases where the corect active relation #union functionality is needed.

For example this wold allow fixing issue #213 of CanCan https://github.com/ryanb/cancan/issues/213

I would be glad to work in this issue, with a little help.

