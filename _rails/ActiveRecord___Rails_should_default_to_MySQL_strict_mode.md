---
title: ActiveRecord / Rails should default to MySQL strict mode
labels: activerecord
layout: issue
---

MySQL, by default, allows behaviour that can lead to loss or mutation of data.

I've searched the issues and the rails-core list and can't find anything mentioning the above. Apologies in advance if this is a discussion that has already occurred.

Two known and relatively common issues:
- MySQL will error if a NULL is inserted into a NOT NULL column, but will not produce an error if a row is updated with  NULL in to a NOT NULL column. SQLite and postgresql will both error.
- MySQL will truncate data inserted into a varchar that is longer than the varchar allows for. SQLite will not truncate (it ignores the limit) and postgresql will error.

Using MySQL in strict mode is 'good practice'. As PostgreSQL behaves as MySQL does in 'strict mode' and PostgreSQL has great support from Rails and AR, I don't see a downside to making this the default. [Documentation for MySQL server modes](http://dev.mysql.com/doc/refman/5.6/en/server-sql-mode.html)

I am willing to submit a pull request to implement this behaviour.

(this issue inspired by my friend's woes with MySQL and Django, documented [in this gist](https://gist.github.com/2495661))

