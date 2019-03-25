---
title: `unscoped` scope caches values
labels: activerecord
layout: issue
---

I've created a default scope in a model named Fixture:

`default_scope { where(public: true) }`

`Fixture.unscoped.all` will then start caching from the table like so:

https://gist.github.com/1806442

I can create and update any rows in the table, but the `Fixture.unscoped.all` call will remain unchanged. Fixture.scoped.all will update appropriately, but not unscoped.

Using Rails 3.2.1, Ruby 1.9.3.

