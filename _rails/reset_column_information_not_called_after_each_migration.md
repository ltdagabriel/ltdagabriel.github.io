---
title: reset_column_information not called after each migration
labels: activerecord
layout: issue
---

I have made a demo app (https://github.com/lulalala/migration-bug) to demonstrate the issue. The readme shows the step to prepare the database, and reproduce the error.

Basically I have a migration B which adds a new column, and a migration C to fill that column. It works okay if those B & C are to run in one go. However I have a migration A which basically does some lookup, and when running A, B and C together, migration C won't update column at all.

If I explicitly call `Item.reset_column_information` at the end of migration A, then the bug disappears. Therefore I suspect that `reset_column_information` is not called after each migration (which I think it should).

I am using Rails 3.2.6 and Ruby 1.9.3

