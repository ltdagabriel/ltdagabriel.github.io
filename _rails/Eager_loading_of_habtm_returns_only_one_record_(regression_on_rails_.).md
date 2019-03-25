---
title: Eager loading of habtm returns only one record (regression on rails 4.1)
labels: activerecord, attached PR, regression
layout: issue
---

However, loading them without eager load returns all of them.
It was working on rails 4.0

Here is a gist testing the issue: https://gist.github.com/scambra/59ee7c8db81c2bf87d09
If I try with active_record 4.0.6 it works.

