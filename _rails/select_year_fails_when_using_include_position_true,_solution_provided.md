---
title: select_year fails when using include_position: true, solution provided
labels: With reproduction steps, actionview, attached PR
layout: issue
---

### Steps to reproduce

``` ruby
<%= select_year Date.current, include_position: true %>
```
### Expected behavior

Output: 

``` html
<select id="date_year_1i" name="date[year(1i)]">...
```
### Actual behavior

Raises: `undefined method '+' for :year:Symbol`
### System configuration

**Rails version**: master, checked on https://github.com/rails/rails/commit/755f6bf3d3d568bc0af2c636be2f6df16c651eb1

**Ruby version**: Any.
### Solution

Change [this](https://github.com/rails/rails/blob/755f6bf3d3d568bc0af2c636be2f6df16c651eb1/actionview/lib/action_view/helpers/date_helper.rb#L1063) line to

``` ruby
field_name = "#{field_name}(#{ActionView::Helpers::DateTimeSelector::POSITION[type]}i)"
```

