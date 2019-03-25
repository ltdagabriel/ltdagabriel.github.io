---
title: ActionController::Live is broken in Rails 4.1 and Rails 4.2
labels: actionpack, regression
layout: issue
---

Symptoms:

```
ActionDispatch::IllegalStateError: header already sent
```

Reproduction instructions:
- `rails generate scaffold product title`
- `rake db:migrate`
- add `include ActionController::Live` to `app/controllers/products_controller.rb`
- `rake test`

