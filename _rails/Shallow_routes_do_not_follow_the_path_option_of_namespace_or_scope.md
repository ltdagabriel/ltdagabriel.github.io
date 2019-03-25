---
title: Shallow routes do not follow the path option of namespace or scope
labels: actionpack, regression
layout: issue
---

I have Rails 4.1.0.rc1 and I have the following in my config/routes.rb

```
  namespace :admin, :path => 'sample' do
    resources :posts do
      resources :comments, :shallow => true
    end
  end
```

Here is the generated routes for the shallow resource

```
                Prefix Verb   URI Pattern                                  Controller#Action
   admin_post_comments GET    /admin/posts/:post_id/comments(.:format)     admin/comments#index
                       POST   /admin/posts/:post_id/comments(.:format)     admin/comments#create
new_admin_post_comment GET    /admin/posts/:post_id/comments/new(.:format) admin/comments#new
    edit_admin_comment GET    /admin/comments/:id/edit(.:format)           admin/comments#edit
         admin_comment GET    /admin/comments/:id(.:format)                admin/comments#show
                       PATCH  /admin/comments/:id(.:format)                admin/comments#update
                       PUT    /admin/comments/:id(.:format)                admin/comments#update
                       DELETE /admin/comments/:id(.:format)                admin/comments#destroy
```

It doesn't work even with scopes.

```
  scope :module => :admin, :as => :admin, :path => 'sample' do
    resources :posts do
      resources :comments, :shallow => true
    end
  end
```

And the result is still the same with the generated routes above.

Also, tried it with Rails 4.0.3. Using the exact namespace routes above, here is the generated routes

```
                Prefix Verb   URI Pattern                                   Controller#Action
   admin_post_comments GET    /sample/posts/:post_id/comments(.:format)     admin/comments#index
                       POST   /sample/posts/:post_id/comments(.:format)     admin/comments#create
new_admin_post_comment GET    /sample/posts/:post_id/comments/new(.:format) admin/comments#new
    edit_admin_comment GET    /admin/comments/:id/edit(.:format)            admin/comments#edit
         admin_comment GET    /admin/comments/:id(.:format)                 admin/comments#show
                       PATCH  /admin/comments/:id(.:format)                 admin/comments#update
                       PUT    /admin/comments/:id(.:format)                 admin/comments#update
                       DELETE /admin/comments/:id(.:format)                 admin/comments#destroy
```

It seems to have correctly built the collection routes however the member routes are still not what I expect them to be.

