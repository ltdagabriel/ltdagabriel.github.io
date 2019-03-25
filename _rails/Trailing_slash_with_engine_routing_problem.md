---
title: Trailing slash with engine routing problem
labels: actionpack, engines, railties
layout: issue
---

In order to define default url options in global way (so that not only controllers are affected but also anything with url helpers included), I do a thing like this:

```
Rails.application.routes.default_url_options[:trailing_slash] = true
```

or (works the same because of the delegation):

```
Rails.application.default_url_options[:trailing_slash] = true
```

This works perfectly fine until I use some routes of a mounted engine. Then I get the trailing slash added in the middle of the route.

```
Foo::Engine.routes.draw do
  resources :bars
end

Baz::Application.routes.draw do
  mount Foo::Engine => '/qux'
end

Foo::Engine.routes.url_helpers.new_bar_path
"/qux//bars/new"
```

So I guess that before combining the two routes ending slash chomp has to be done.

