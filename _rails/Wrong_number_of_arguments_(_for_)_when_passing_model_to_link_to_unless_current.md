---
title: Wrong number of arguments (0 for 1) when passing model to link_to_unless_current
labels: actionview, regression
layout: issue
---

### Steps to reproduce

- Pass a model object as the second argument to `link_to_unless_current` in Rails 5.1.0.rc2:

```slim
            ul.vertical.menu
              - columns_with_published_posts.each do |column|
                li = link_to_unless_current column.name, column do
                  = link_to column.name, column, class: :active
```

### Expected behavior

- Pass the object to `url_for` to determine the path to compare against

### Actual behavior

```
wrong number of arguments (given 1, expected 0)
```

Full stack trace: https://gist.github.com/jbhannah/fd3fef8e2a8a341d8b29fc5f772ea5a6

### System configuration
**Rails version**: 5.1.0.rc2

**Ruby version**: 2.4.1

