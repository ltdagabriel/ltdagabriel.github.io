---
title: build_association method does not rollback parent correctly if child fails to save
labels: activerecord
layout: issue
---

I have 2 models like the following

```
Class Post  
  has_many :comments, :dependent => :destroy 
end  

Class Comment  
  validates_presence_of :post
  validates_presence_of :comment
  belongs_to :post  
end  
```

In Comments controller,

```
def create
  comment = @post.comments.new(params[:comment])
  if comment.save
    // some code
  else
    // some code
  end
end
```

routes.rb

```
resources :posts

resources :posts do
    resources :comments
end

resources :comments
```

When the comment is invalid as per the validation, the comment is not saved. But when the @post object is accessed in the view, it contains a comment object with nil id. This did not happen in Rails 2.3.11. We are upgraded to Rails 3.1 and then now to Rails 3.2. This comment object with nil id disappears when I do @post.reload. 

I tried to interchange build and new methods. It had the same result as build. Is it the expected behavior or is any of my gems or plugins creating this issue?

