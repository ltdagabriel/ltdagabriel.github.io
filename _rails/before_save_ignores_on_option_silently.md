---
title: before_save ignores on: option silently
labels: activerecord, pinned
layout: issue
---

**Problem**

It looks like the following line will not do what users expect:

```
before_save :do_something, on: :create
```

The `on: :create` option will just get silently ignored and `do_something` will get called after _every_ save on the record, not just the initial create. Same goes for `after_save`.

This might cause some hard to trace bugs in your rails app. I just stumbled upon this today by accident, I asked around and a lot of my coworkers weren't aware either that this is how it works.

Instead users have to do:

```
before_create :do_something
```

see also http://stackoverflow.com/questions/10640221/is-on-create-valid-for-a-before-save-callback-in-rails-3-2-3

**Suggestion**

Either have `before_save` with `on: :create` option behave like `before_create` or raise an error that the `:on` option is not allowed here.

