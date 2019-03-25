---
title: Add after_create|update|destroy_commit as aliases for after_commit :x, on: :y
labels: activerecord
layout: issue
---

The after_commit callback is seeing a lot more use now that it's the primary method to hooking a job onto the lifecycle of a record. But the default setup is that after_commit runs on every transaction committed. That is very rarely a useful callback. This means you're constantly using the `on:` key to specify what transaction type you're talking about.

I propose we add `after_create_commit`, `after_update_commit`, and `after_destroy_commit` to make this clearer.

Before:

``` ruby
after_commit :add_to_index_later, on: :create
after_commit :update_in_index_later, on: :update
after_commit :remove_from_index_later, on: :destroy
```

After:

``` ruby
after_create_commit  :add_to_index_later
after_update_commit  :update_in_index_later
after_destroy_commit :remove_from_index_later
```

This begins the the lede, WHEN is this happening, rather than at what point in the execution of that WHEN.

