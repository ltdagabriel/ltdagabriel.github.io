---
title: ActiveRecord::ImmutableRelation is raised when collection caching and HTTP caching are used together
labels: activerecord
layout: issue
---

Given an Active Record relation, `ActionController::ConditionalGet#fresh_when` calls the relation’s `maximum` method, which indirectly calls the `arel` method.

If the same relation is rendered as a cached collection, an `ActiveRecord::ImmutableRelation` error will be raised:

```erb
<%= render partial: 'posts/post', collection: @posts, cached: true %>
```

`ActiveRecord::Railties::CollectionCacheAssociationLoading#relation_from_options` checks whether the relation it chooses is loaded before calling `ActiveRecord::Relation::QueryMethods#skip_preloading!`, but that method can raise `ActiveRecord::ImmutableRelation` even if the relation isn't loaded (i.e. when `ActiveRecord::Relation::QueryMethods#arel` was previously called).

This bug was introduced in #31250. A minimal sample application demonstrating it is available [here](https://github.com/georgeclaghorn/rails-bug-32534). See the README for a short code walkthrough.

/cc @lsylvester
