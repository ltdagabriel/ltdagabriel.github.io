---
title: default_scope breaks chained scopes in 3.2.13
labels: activerecord, regression
layout: issue
---

We're trying to upgrade to 3.2.13 from 3.2.12 and encountered a strange bug with chained scopes for ActiveRecord classes that have a default scope.

Under 3.2.13, the chained scope `Animal.where(:id => 12345).find(Animal.first.id)` generates the SQL below, which returns the first Animal, while it should not find anything.
`SELECT "animals".* FROM "animals" WHERE "animals"."alive" = 't' AND "animals"."id" = 11 LIMIT 1`

Under 3.2.12 it generates the correct SQL:
`SELECT "animals".* FROM "animals" WHERE "animals"."alive" = 't' AND "animals"."id" = 12345 AND "animals"."id" = 10 LIMIT 1`

[Gist showing problem](https://gist.github.com/pivotal-chorus/5200366)

