---
title: Belongs to with nil scope gives confusing error message
labels: With reproduction steps, activerecord, attached PR, pinned
layout: issue
---

The issue can be reproduced by creating a belongs_to association with an optional scope which returns nil.

```
belongs_to :account, -> { nil }
```

This generates the following error when calling the parent association:
undefined method `visited' for nil:NilClass

The stack trace is not very useful either. It can be non-obvious locating the issue if the scope does not obviously return nil, or only sometimes does (for example, if there's an if statement).

