---
title: validations not called when model updating using nested attributes
labels: activerecord, attached PR
layout: issue
---

This is a reopen of #618 (import of https://rails.lighthouseapp.com/projects/8994/tickets/2646)

I am just upgrading my rails app to rails 3.2 and I have just discovered that the workaround suggested by Matt Jones:

``` ruby
    if value.reject { |v| v.marked_for_destruction? }.size < 1
```

Is still needed...

There are patches (for tests) that demonstrates the problem...

