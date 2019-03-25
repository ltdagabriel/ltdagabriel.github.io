---
title: Controller generator namespace bug 
labels: actionpack
layout: issue
---

When i run controller generator with namespaced controller

```
rails g controller admin/dashboard index
```

Files are fine, but route has no namespace

``` ruby
get "dashboard/index"
```

