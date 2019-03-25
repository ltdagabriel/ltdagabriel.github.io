---
title: Attributes API with virtual attributes don't work in form builders without a value?
labels: activerecord, attached PR
layout: issue
---

Playing with virtual attributes via the Attributes API in Rails 5. They don't seem to work in Form Builders unless you initialize the attribute with a value before the form builder gets ahold of it:
### Steps to reproduce

``` ruby
# app/models/user.rb
class User < ApplicationRecord
  # first_name, last_name in database
  attribute :title, :string # not in DB
end

# app/controllers/users_controller.rb
class UsersController < ApplicationController
  def edit
    @user = User.find(params[:id])
  end
end
```

``` erb
<%# app/views/users/edit.html.erb %>
<%= form_for @user do |f| %>
  <%= f.text_field :first_name %>
  <%= f.text_field :last_name %>
  <%= f.text_field :title %>
<% end %>
```
### Expected behavior

Should show a form with three input boxes, one each for `first_name`, `last_name` and `title`.
### Actual behavior

`ActiveModel::MissingAttributeError: missing attribute: title`

I'm able to get the form to render properly if, in the controller, I set the title to an empty string:

``` ruby
class UsersController < ApplicationController
  def edit
    @user = User.find(params[:id])
    @user.title = ''
  end
end
```

I thought maybe I could do this automatically with `attribute :title, :string, :default = ''` but I get the same error. :( Maybe this is expected (and desired?) behavior? I just haven't seen it documented anywhere.

Last few items in the stack trace:

```
activerecord (5.0.0) lib/active_record/attribute_methods/read.rb:66:in `block in _read_attribute'
activerecord (5.0.0) lib/active_record/attribute_set.rb:42:in `block in fetch_value'
activerecord (5.0.0) lib/active_record/attribute.rb:196:in `value'
activerecord (5.0.0) lib/active_record/attribute_set.rb:42:in `fetch_value'
activerecord (5.0.0) lib/active_record/attribute_methods/read.rb:66:in `_read_attribute'
activerecord (5.0.0) lib/active_record/attribute_methods/read.rb:36:in `__temp__d6563737167656'
ransack (1.7.0) lib/ransack/helpers/form_builder.rb:10:in `value'
```
### System configuration

**Rails version**: 5.0.0

**Ruby version**: 2.3.1p112

