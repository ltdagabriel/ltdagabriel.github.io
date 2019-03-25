---
title: Calling ActiveModel::Errors#[] changes state of the message hash for no reason
labels: attached PR
layout: issue
---

Here's a demo of the issue:

``` ruby
[18] pry(main)> expense.errors.keys
=> []

[19] pry(main)> expense.errors[:something]
=> []

[20] pry(main)> expense.errors.keys
=> [:something]
```

