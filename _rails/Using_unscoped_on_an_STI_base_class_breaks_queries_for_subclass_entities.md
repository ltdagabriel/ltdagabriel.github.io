---
title: Using unscoped on an STI base class breaks queries for subclass entities
labels: activerecord, attached PR
layout: issue
---

We hit an interesting gotcha with STI models where one queries the base model using the `unscoped` relation.

The problem is that any queries for subclass models will not include the `type` condition if those queries occur in a stack frame that is beneath the call to `unscoped`.

Here's a gist with a test case that recreates the issue: https://gist.github.com/dougbarth/44eb4adc28f8d6026322

To explain the problem a bit more clearly, consider the case where we have the following STI hierarchy: `SubPost < Post < ActiveRecord::Base`. `SubPost` includes an `after_save` callback that queries the database for `SubPost` records

Code like this will work as expected:

``` ruby
class SubPost < Post
  after_save :query_subposts

  def query_subposts
    SubPost.all
  end
end

post = Post.unscoped.find(some_id)  # This ID references a SubPost row
post.touch
post.save!    # query_subposts callback includes a condition on type = 'SubPost'
```

However, if we refactor the logic to move the find and modifying logic onto the `Post` class, the callback's query drops the `type` condition.

``` ruby
class Post
  def self.find_and_touch(some_id)
    p = find(some_id)
    p.touch
    p.save!   # query_subposts skips the type condition
  end
end

Post.unscoped.find_and_touch(some_id) # Loading a SubPost row
```

We're happy to try to fix this, but we wanted to get some feedback on whether code like this should work. From our perspective, having callback code that dramatically changes its query based on the calling frame is very surprising.

/cc @DavidRagone

