---
title: time_tag helper doesn't use Y-m-d format for date
labels: actionview
layout: issue
---

``` ruby
helper.time_tag Item.first.created_at.to_date
# => "<time datetime=\"2013-02-14T00:00:00+00:00\">February 14, 2013</time>"
```

I expected:

```
<time datetime="2013-02-14">February 14, 2013</time>
```

as in docs.

