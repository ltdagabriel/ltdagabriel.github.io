---
title: has_one association=(associate) should trigger save
labels: activerecord
layout: issue
---

activerecord/lib/active_record/associations.rb states:

``` ruby
      # [association=(associate)]
      #   Assigns the associate object, extracts the primary key, sets it as the foreign key,
      #   and saves the associate object.
```

Since commit https://github.com/yahonda/rails/commit/42dd5d9f2976677a4bf22347f2dde1a8135dfbb4 to fix issue #7191, association=(associate) will not trigger a call to save in some cases.

Specifically, Rails 3.2.8 would trigger a save if setting the association to itself. In Rails 3.2.9 and later, and in the master branch, this no longer occurs. I claim this is necessary if the associate has changed.

I will be creating a pull request with a unit test which demonstrates the problem and which fixes the issue. This is against the master branch and should be backported to the 3-2-stable branch. The patch does not apply cleanly against 3-2-stable but it should be a simple matter for someone else to apply it.

The consequences of not applying this patch is that applications that relied on the behaviour of 2.3 and <= 3.2.8 to save has_one associations will fail in >= 3.2.9, as ours did.

