---
title: AC::Parameters doesn't compare (==) in a sane way
labels: actionpack, attached PR
layout: issue
---

```
ActionController::Parameters.new(foo: 'bar') == ActionController::Parameters.new(foo: 'bar')
=> false
```

Compare to:

```
{ foo: 'bar' } == { foo: 'bar' }
=> true
```

Why is this behavior different?

