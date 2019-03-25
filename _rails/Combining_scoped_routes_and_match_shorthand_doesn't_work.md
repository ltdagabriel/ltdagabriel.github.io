---
title: Combining scoped routes and match shorthand doesn't work
labels: actionpack
layout: issue
---

If I have a route that looks like this:

``` ruby
scope "/:locale" do
  match "foo/bar"
end
```

And run `rake routes`, this is the output:

```
foo_bar  /:locale/foo/bar(.:format) :locale/foo#bar
```

I would expect the following output:

```
foo_bar  /:locale/foo/bar(.:format) foo#bar
```

It prepends the scope to the controller. When I test to access the route I get the following error:

```
wrong constant name :locale
```

I'm using Rails 3.2.8

