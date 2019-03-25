---
title: ActionController::Parameters#== does not works as expected
labels: actionpack, activesupport, attached PR
layout: issue
---

`ActionController::Parameters#==` will return false even if the hash and AC::Parameters hash same because of the `HashWithIndifferentAccess`. But the documentation of `==` method says we can compare `ActionController::Parameters` with `Hash-Like` objects.

``` ruby
hash = { foo: :bar }
params = ActionController::Parameters.new(hash)
params == hash #returns false
```

I believe this is not the bug about `ActionController::Parameters` this is about `HashWithIndifferentAccess`. I think we should implement `==`, `eql?` methods in `HashWithIndifferentAccess` to give correct results. If you are OK with implementing these methods in `HashWithIndifferentAccess` I'm going to finish my initial work on it.

