---
title: specifying the format option in a "scope" block in routes.rb is being ignored in Rails 4 beta 1
labels: actionpack, regression
layout: issue
---

It seems to be a regression bug: https://github.com/rosenfeld/rails-scope-format-bug

If you use this in the routes it won't work properly:

``` ruby
scope format: false do
    get "main/index"
end
```

Rails 4 beta 1 will allow you to GET /main/index.html when it shouldn't. This will work on Rails 4 beta 1 though:

``` ruby
get "main/index", format: false
```

