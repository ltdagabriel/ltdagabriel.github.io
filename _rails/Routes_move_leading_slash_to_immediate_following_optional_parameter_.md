---
title: Routes move leading slash to immediate following optional parameter 
labels: actionpack, stale
layout: issue
---

For such a routes definition:

``` ruby
RoutesBug::Application.routes.draw do
  scope "/(:kiszka-):koza" do
    root to: "hello#index"
  end
end
```

```
$ rake routes
root  (/:kiszka-):koza(.:format) hello#index
```

and thus path like `/foo` can't be matched. The only way to get the path matched is to provide both parameters like `/foo-bar`. 

