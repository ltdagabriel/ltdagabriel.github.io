---
title: Path helpers don't omit optional parameters when they are set to the default
labels: stale
layout: issue
---

I think I found a follow-up to #27454.

When a route is defined with dynamic segments and you want to generate a path where one of the optional parameters is set to it's default, Rails 5 (both 5.0.6 and 5.1.4) will include the optional parameter whereas Rails 4 did omit them.

### Steps to reproduce

Generate a new Rails app and add the following routes to the routes file:

```ruby
# One optional param with default
get "/(:locale)/test1" => "doesnt#matter", defaults: { locale: "en" }, as: "test1"

# Two optional params, one with default
get "/(:locale)/test2/(:other)" => "doesnt#matter", defaults: { locale: "en" }, as: "test2"

# One optional param with default, one mandatory param
get "/(:locale)/test3/:other" => "doesnt#matter", defaults: { locale: "en" }, as: "test3"

# Two optional params, both with defaults (the use case of #27454)
get "(:locale)/test4/(:other)" => "doesnt#matter", defaults: { locale: "en", other: "bar" }, as: "test4"
```

### Expected behavior

Open the Rails console and generate paths for the routes with different variations of passed parameters. Most of the paths will be generated the same in both Rails 4 and Rails 5:

```ruby
app.test1_path                               # => "/test1"
app.test1_path(locale: "de")                 # => "/de/test1"

app.test2_path                               # => "/test2"
app.test2_path(locale: "de")                 # => "/de/test2"
app.test2_path(locale: "de", other: "foo")   # => "/de/test2/foo"

app.test3_path(locale: "de", other: "foo")   # => "/de/test2/foo"

# This is the use case of issue #27454. It works after the fix.
app.test4_path                               # => "/test4"
app.test4_path(locale: "de")                 # => "/de/test4"
app.test4_path(other: "foo")                 # => "/test4/foo"
app.test4_path(locale: "de", other: "foo")   # => "/de/test4/foo"
```

However, whereas Rails 4 generates these routes:

```ruby
app.test2_path(other: "foo")                 # => "/test2/foo"
app.test3_path(other: "foo")                 # => "/test3/foo"
```

and I expect Rails 5 to do the same …

### Actual behavior

… Rails 5 actually generates these:

```ruby
app.test2_path(other: "foo")                 # => "/en/test2/foo"
app.test3_path(other: "foo")                 # => "/en/test3/foo"
```

### System configuration

**Rails version**: 4.2.8 vs. 5.0.6 and 5.1.4

**Ruby version**: 2.4.2

