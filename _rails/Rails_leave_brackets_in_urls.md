---
title: Rails 4 leave brackets in urls
labels: actionpack
layout: issue
---

In rails 4 when route has multiple optional parameters url helper add closing bracket to path/url

Example:

```
get 'post(/:action(/:id))' => 'posts#index', as: :posts
```

and run in console: 

```
>> app.posts_path
=> "/post)"
```

Tested on Rails 4.0.0.beta1 && master branch

