---
title: ActiveRecord#method_missing odd behavior
labels: activerecord
layout: issue
---

There was an issue filed about a bug that caused RSpec to exit with 0 on an exception. The bug has since been [filed](https://bugs.ruby-lang.org/issues/8501) upstream with ruby-lang.

The odd part about this issue is that I was only able to trigger it when ActiveRecord#method_missing was called. The details on how to do that are in rspec/rspec-core#928. Ub that issue, @alindeman said:

> I think there's also reason to think it's buggy for ActiveRecord to add an `inspect` method to the model class that raises an exception when the database is unavailable.`.

Can anyone confirm that this is the intended behavior?

