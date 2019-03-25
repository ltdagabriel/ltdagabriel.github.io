---
title: to_param method being deprecated gives warnings when params passed in a path helper
labels: actionview, attached PR
layout: issue
---

### Steps to reproduce

Create params object and pass it to a path helper

```ruby
    params = ActionController::Parameters.new
    params[:test] = {}
    params[:test][:truthy] = "1"
    params[:test][:falsey] = "0"

example_path(params: { params[:test] })
```

### Expected behavior
No deprecation messages

### Actual behavior
Deprecation warning as to_param method is a Hash thing

```bash
Method to_param is deprecated and will be removed in Rails 5.1, as `ActionController::Parameters` no longer inherits from hash. Using this deprecated behavior exposes potential security problems. If you continue to use this method you may be creating a security vulnerability in your app that can be exploited. Instead, consider using one of these documented methods which are not deprecated: http://api.rubyonrails.org/v5.0.0.1/classes/ActionController/Parameters.html
```

### Some background

We're using Ransack gem to handle search in our data tables. The query string ends up being params[:q] With this being now ActionController::Parameters, instead of hash it results in deprecation warning when passing params[:q] to path helper as an argument (as it's trying to call to_param on params[:q]) i.e.:

```ruby
search_path(format: "csv", params: { data_table_id: params[:data_table_id], q: params[:q] })
```

Gives a deprecation warning and will break in Rails 5.1


### System configuration
**Rails version**: From 5-0-stable branch

**Ruby version**: 2.3.1p112

