---
title: No bind parameters for ranges in where clause
labels: activerecord
layout: issue
---

For example `Model.where(numerical_value: 5..10)` still generates an entry in the prepared statements cache (tested with v4.2.5 and v5.0.0-beta1)

This is very bad because of #21992 
Similar issues where solved in https://github.com/rails/rails/commit/cbcdecd2c55fca9613722779231de2d8dd67ad02 
A similar problem was reported in #22250 and fixed as well for v5.0.0

@sgrif If you could have a stab at this, that would be very much appreciated.

