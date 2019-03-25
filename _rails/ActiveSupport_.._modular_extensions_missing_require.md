---
title: ActiveSupport 3.2.6 modular extensions missing require
labels: activesupport
layout: issue
---

See https://gist.github.com/3012323

With ActiveSupport 3.2.3 I was able to require the `active_support/core_ext/numeric/time` by itself to get access to things like `4.minutes.ago`, but doing the same in 3.2.6 throws an error in the `ago` method presumable because `active_support/core_ext/time/zones` is never required.

I tried for a bit to locate the appropriate location for the statement, but I'm not very familiar with the Rails source. I figured its an easy fix for someone who is...

