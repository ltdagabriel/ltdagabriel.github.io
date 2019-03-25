---
title: Limit touching to once per transaction
labels: activerecord
layout: issue
---

If you have a deeply nested hierarchy of objects like so:

``` ruby
Comment belongs_to :message, touch: true
Message belongs_to :project, touch: true
Project belongs_to :account, touch: true
```

And you do something like:

``` ruby
comments.size # 3
Comment.transaction { comments.each &:touch! }
```

That'll generate 3x touches to each Message, Project, and Account, when in reality they all only need one touch. It would be preferably to have a touch manager of sorts, that ensure that only one touch would happen per transaction.

