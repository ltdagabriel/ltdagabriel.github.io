---
title: number_to_percentage crashes when passed Float::NaN with options (precision: x) ref #14405
labels: actionview
layout: issue
---

A similar error occurs in the block of code above the regression fix documented for closing #14405 report.

The tests don't cover the situation of passing in options, so it doesn't catch the fail case that occurs when you pass in "precision: 0" or any other precision value.

To reproduce: call number_to_percentage(Float::NaN, precision: 0)

I'll take a stab at fixing this shortly, but it maybe easier for the fixer of #14405 to take care of it.

