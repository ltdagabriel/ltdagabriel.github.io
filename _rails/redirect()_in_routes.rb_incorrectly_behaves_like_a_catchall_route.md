---
title: redirect() in routes.rb incorrectly behaves like a catch-all route
labels: actionpack
layout: issue
---

This similar to the issue described in #2430, but the solution described there is incomplete. Placing the redirect route later in the routemap only prevents the redirect from catching another route so long as that other route is specified correctly.

However, if for example a parameter is missing or the route doesn't exist, the routemap will swallow the routing error and simply use the redirect route with `action` and `controller` as parameters.

As an example, we have the following in our `routes.rb`:

``` ruby
match "/myresources" => redirect("/deals")
```

Now if you incorrectly specify another non-existent route like this:

``` ruby
url_for(:controller => "blargh", :action => "blargh")
```

Instead of getting a Routing Error, it returns:

``` ruby
"http://localhost/myresources?action=blargh&controller=blargh"
```

This is incorrect.

