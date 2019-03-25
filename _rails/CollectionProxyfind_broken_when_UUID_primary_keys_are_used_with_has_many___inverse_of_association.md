---
title: CollectionProxy#find broken when UUID primary keys are used with has_many / inverse_of association
labels: activerecord, attached PR
layout: issue
---

Given Post and Comment models having UUID primary keys, where Post has_many Comments:

```
post = Post.create!
comment = post.comments.create!
post.comments.find(comment.id)
```

This should successfully find the newly-created comment. Instead, it throws ActiveRecord::RecordNotFound:

```
ActiveRecord::RecordNotFound: Couldn't find Comment with id=["bca2decc-51e4-4e58-b45b-6afae21c2168"] [WHERE "comments"."post_id" = $1]
```

This works fine, however:

```
post.comments.first
```

As does this:

```
post.comments.where(id: comment.id).first!
```

And this:

```
Comment.find(comment.id)
```

