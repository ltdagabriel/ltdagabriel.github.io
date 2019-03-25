---
title: Rails 4.2: Model.reflections now uses strings rather than symbols as keys
labels: activerecord
layout: issue
---

1f31488499111fdfce79d8dc1cc8fb008f7cdb25 changed the `reflections` method to return a hash with strings, rather than symbols, as the keys.  I imagine there was a good reason for this change, but it's not backwards-compatible.
1. How about having it return a HashWithIndifferentAccess?
2. The documentation implies that the keys are symbols; this should be updated as well.

