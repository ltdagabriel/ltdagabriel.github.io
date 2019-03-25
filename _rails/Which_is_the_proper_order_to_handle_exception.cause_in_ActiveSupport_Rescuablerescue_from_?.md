---
title: Which is the proper order to handle exception.cause  in ActiveSupport::Rescuable#rescue_from ?
labels: stale
layout: issue
---

### Summary

Since Rails 5.0, the order in which handler is applied for exceptions including cause has been changed.
It looks like a deliberate change as written in the #25018 comment, but I think there are at least the following problems.

### Probrem

```ruby
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  rescue_from StandardError, with: :handle_500
  rescue_from ActiveRecord::RecordNotFound, with: :handle_404

  private

  def handle_500(error)
    render 'errors/error', status: 500
  end

  def handle_404(error)
    render 'errors/error', status: 404
  end
end
```

```erb
<%= Article.find(10) %>
```

if Article with `id==10` does not exist, handle_ 404 was executed in Rails 4.2.8,
Since Rails 5.0.0, handle_ 500 is now executed.

Errors occurring in view are wrapped in ActionView::Template::Error.
In Rails 4.2.8, when error has cause, It looked for a handler that matched `exception.cause`.
For Rails 5.0.0 and later, the `exception.cause` check is done only if the wrapping error does not match any handler.

I think the behavior before 4.2.8 is preferable in the above case.

I know that shouldn't do `rescue_from StandardError` be listed in RailsGuide.
This may not be an appropriate example.
However, I think that we always encounter this problem when we need to reference cause and want to deal with special errors and generic errors in order.

### Solution
How about restoring the logic of #24158 to activesupport/lib/active_support/rescuable.rb ?

### System configuration
**Rails version**:
4.2.8, 5.0.0, 5.1.2

**Ruby version**:
2.3.1
