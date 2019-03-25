---
title: http://edgeguides.rubyonrails.org/getting_started.html#showing-posts - "If you submit the form again now, Rails will complain about not finding the show action" - this is incorrect.  Actual error is a security error.
labels: attached PR, docs
layout: issue
---

ActiveModel::ForbiddenAttributesError in PostsController#create
ActiveModel::ForbiddenAttributesError
Extracted source (around line #6):

```
def create
    @post = Post.new(params[:post])

    @post.save
    redirect_to @post
```

