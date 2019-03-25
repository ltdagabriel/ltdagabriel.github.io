---
title: ActiveRecord 4.0.3 unnecessary requests to db
labels: activerecord, attached PR
layout: issue
---

Hello!
[Here](https://gist.github.com/kia84/9249804) you can see the test, that show this bug.
We try assign empty array to empty collection, and in output we can see empty transaction block:

```
D, [2014-02-27T17:15:31.412905 #29146] DEBUG -- :    (0.1ms)  begin transaction
D, [2014-02-27T17:15:31.413080 #29146] DEBUG -- :    (0.0ms)  commit transaction
```

---

I delete the gist.
Here is a short meaning of the problem (for searchers and history):

``` ruby
post = Post.create!
post.comments.inspect
# => #<ActiveRecord::Associations::CollectionProxy []>
post.comments = []
#   (0.9ms)  BEGIN
#   (0.7ms)  COMMIT
# => []
```

