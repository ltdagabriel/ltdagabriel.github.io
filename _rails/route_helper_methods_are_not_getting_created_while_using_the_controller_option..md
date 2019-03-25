---
title: route helper methods are not getting created while using the controller option.
labels: actionpack, stale
layout: issue
---

I have the the below chunk inside my _routes.rb_ file.

``` ruby
  controller :post do
    post 'post/:id/like' =>  :like
    delete 'post/:id/unlike' =>  :unlike
  end
```

But it is not generating helper methods.

``` sh
[shreyas@app (master)]$ rake routes | grep post
                                    POST       /post/:id/like(.:format)                       post#like
                                    DELETE     /post/:id/unlike(.:format)                     post#unlike
[shreyas@app (master)]$ rails -v
Rails 4.2.1
```

I found [this](http://api.rubyonrails.org/classes/ActionDispatch/Routing.html) in the doco as : 

> Note: when using controller, the route is simply named after the method you call on the block parameter rather than map.

