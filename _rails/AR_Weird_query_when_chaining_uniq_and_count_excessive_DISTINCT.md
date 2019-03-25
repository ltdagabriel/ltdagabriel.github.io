---
title: AR: Weird query when chaining `uniq` and `count`: excessive `DISTINCT`
labels: activerecord, attached PR
layout: issue
---

Consider this statement:

``` ruby
User.uniq.count    # it can and often do have some `where`-s and `join`-s before `uniq`, but this statement already shows the problem
```

generates this SQL:

``` sql
SELECT DISTINCT COUNT(DISTINCT `users`.`id`) FROM `users`
```

where one would expect having just:

``` sql
SELECT COUNT(DISTINCT `users`.`id`) FROM `users`
```

(no redundant `DISTINCT`). Usually it does not make a difference, since `DISTINCT` out of one value (result of count) is the same, but if you look at MySQL docs: http://dev.mysql.com/doc/refman/5.5/en/group-by-optimization.html it says that it will not use loose index scan with this query. Which actually makes query extremely slow on big (millions) table(s). Removing excessive `DISTINCT` makes it use right indexes and it becomes very fast.

Is it expected behavior? Is there any workaround except avoiding `uniq` + `count` ?

Rails: 4.0.12
Ruby: 2.1.5
MySQL: Percona 5.6

