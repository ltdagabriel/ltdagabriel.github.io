---
title: Setting integer column to NaN throws FloatDomainError (NaN)
labels: activerecord
layout: issue
---

This has been a change since 3.2.8 introduced by 96a13fc7 — in the same vein as, and _almost_ fixed by 3525a9b5 (pulls #8718 / #8734)

(As a side note, prior to 96a13fc7, there was a similar issue as pointed out in #8718: NaN is truthy, so it was being interpreted as 1 in integer columns. This was also scarily incorrect, but was addressed when this issue began)

The issue now (after 96a13fc7, and still existing after 3525a9b5) is that attepting to set an integer column = `NaN` throws `FloatDomainError (NaN)`

Can be easily reproduced by:

``` ruby
record.integer_column_name = Float::NAN
```

I encounter the issue when using RubyAMF to receive uninitialized records from a Flex app. `NaN` is the default value for uninitialized Numbers in Flex/Flash, so it's very common in that case. The error is raised when RubyAMF internals set the attributes hash containing NaN values for integer columns.

Reported over at rubyamf/rubyamf#17 also to bring the issue to their attention with more detail on the rubyamf exception there.

I think it's proper for Rails to handle this value cleanly. It was almost fixed in 3525a9b5 since `respond_to?(:to_i)` is checked, but unfortunately NaN _does_ respond to `to_i`, so the issue still occurs.

I think the fix is to check for `.nan?` in `value_to_integer`, and if `nan?` return nil instead, or rescue the error and return nil. So `Column.value_to_integer` might use `value.to_i rescue nil` instead of just `value.to_i`

However, this has the consequence of treating Infinity and -Infinity as nil, which may or may not be desired. Should probably decide how we want those treated and make `value_to_integer` more robust with expected inputs.

Posting issue for guidance from @rafaelfranca and/or @jstirk before continuing since they have more experience with this code, but I am happy to make a pull!

