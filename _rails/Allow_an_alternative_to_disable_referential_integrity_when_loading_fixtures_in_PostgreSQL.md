---
title: Allow an alternative to disable_referential_integrity when loading fixtures in PostgreSQL
labels: activerecord
layout: issue
---

As soon as someone using PostgreSQL adds foreign keys checks in migration, the fixtures will not load, raising the infamous `PG::Error: ERROR:  permission denied: "RI_ConstraintTrigger_..." is a system trigger`.

Often the suggested solution is to connect to the database as a superuser, but some people consider this _extremely dangerous and unacceptable_.

A possible solution would be to:
**1)** inform the users that they may define these constraints as "DEFERRABLE INITIALLY IMMEDIATE"
**2)** make fixtures to call "SET CONSTRAINTS ALL DEFERRED" instead of "ALTER TABLE ... DISABLE TRIGGER ALL" in (or instead of) `disable_referential_integrity`

Because some people may need the current behaviour, maybe a configuration option like `fixtures.defer_triggers_instead_of_disabling = false` would make them happy?

