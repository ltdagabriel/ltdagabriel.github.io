---
title: AR 3.1 / pgbouncer / PostgreSQL issue with prepared statements
labels: PostgreSQL, activerecord, stale
layout: issue
---

Using exec_cache with pgbouncer in transaction mode, as the connections pool can cause random problems.

Scenario:
- the application performs a query through ActiveRecord:

Something.find 2
Something Load (0.9ms) SELECT "somethings" .\* FROM "somethings" WHERE "somethings." Id "= $ 1 LIMIT 1 [[" id ", 2]]
- pgbouncer connects to the backend (lets call it PG-1)
- ActiveRecord creates a prepared statement
- pgbouncer prepares for the backend PG-1 prepared statement called a3:

2011-06-10 9:34:04 EDT LOG: duration: 0.505 ms parse a3: SELECT "somethings" .\* FROM "somethings" WHERE "somethings." Id "= $ 1 LIMIT 1
- ActiveRecord execute prepared statement
- pgbouncer performs pg backend EXECUTE a3 (...) on PG-1

> 2011-06-10 9:34:04 EDT LOG: duration: 0.048 ms bind a3: SELECT "somethings" .\* FROM "somethings" WHERE "somethings." Id "= $ 1 LIMIT 1
> 2011-06-10 9:34:04 GMT DETAIL: parameters: $ 1 = '2 '
> 2011-06-10 9:34:04 EDT LOG: duration: 0.045 ms execute a3: SELECT "somethings" .\* FROM "somethings" WHERE "somethings." Id "= $ 1 LIMIT 1
> 2011-06-10 9:34:04 GMT DETAIL: parameters: $ 1 = '2 '
- the application receives the result

> Something Id: 2, symbol: "sss2", description: nil, created_at: "2011-06-10 07:19:34", updated_at: "2011-06-10 07:19:34"
- at this time a different application process connects to pgbouncer, goes to the backend PG-1 and takes it (for example - with begin transaction)
- the first application process once again executes the same query, with other parameters

Something.find 3
- pgbouncer connects to the backend (but this time it goes to the PG-2, because the PG-1 is busy)
- ActiveRecord has prepared statement in exec_cache (called a3)
- ActiveRecord execute prepared statemnet a3

> Something Load (1.2ms) SELECT "somethings" .\* FROM "somethings" WHERE "somethings." Id "= $ 1 LIMIT 1 [[" id ", 3]]
- pgbouncer performs  EXECUTE a3 (...) on backend PG-2
- Fail - the PG-2 has no such prepared statement

> PGError: ERROR: Prepared statement "a3" does not exist

Solutions:
- switching pgbouncer mode to session - bad, because it increases the consumption of resources
- wrapping request in transaction - wrong - also increases consumption of resources, with additional side effec - there may be long-lasting transactions that will cause deadlocks
- add option to not use ActiveRecord exec_cache - fix all issues with pgbouncer and additionaly another described [here](http://www.depesz.com/index.php/2008/05/10/prepared-statements-gotcha/)

