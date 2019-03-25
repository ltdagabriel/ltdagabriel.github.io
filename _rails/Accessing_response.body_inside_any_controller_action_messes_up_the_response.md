---
title: Accessing `response.body` inside any controller action messes up the response
labels: actionpack, attached PR, regression
layout: issue
---

I was trying to set strong ETags header by using the response.body inside the controller 

``` ruby
def set_etag # after_action callback
  response.headers["ETag"] = Digest::MD5.hexdigest(response.body)
end
```

But it gives following error - 

```
ActionDispatch::IllegalStateError (header already sent):

app/controllers/posts_controller.rb:8:in `index'
  Rendering /Users/prathamesh/Projects/sources/rails/actionpack/lib/action_dispatch/middleware/templates/rescues/diagnostics.html.erb within rescues/layout
  Rendering /Users/prathamesh/Projects/sources/rails/actionpack/lib/action_dispatch/middleware/templates/rescues/_source.html.erb
  Rendered /Users/prathamesh/Projects/sources/rails/actionpack/lib/action_dispatch/middleware/templates/rescues/_source.html.erb (4.0ms)
  Rendering /Users/prathamesh/Projects/sources/rails/actionpack/lib/action_dispatch/middleware/templates/rescues/_trace.html.erb
  Rendered /Users/prathamesh/Projects/sources/rails/actionpack/lib/action_dispatch/middleware/templates/rescues/_trace.html.erb (3.7ms)
  Rendering /Users/prathamesh/Projects/sources/rails/actionpack/lib/action_dispatch/middleware/templates/rescues/_request_and_response.html.erb
  Rendered /Users/prathamesh/Projects/sources/rails/actionpack/lib/action_dispatch/middleware/templates/rescues/_request_and_response.html.erb (0.7ms)
  Rendered /Users/prathamesh/Projects/sources/rails/actionpack/lib/action_dispatch/middleware/templates/rescues/diagnostics.html.erb within rescues/layout (59.1ms)
```

