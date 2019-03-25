---
title: Optimistic locking does not work well across web requests
labels: activerecord, attached PR
layout: issue
---

It seems the current change on optimistic locking  broken its old behavior when use it across web request.
I am not sure was it intended to do this way or a bug?

### Steps to reproduce
I use a simple rails application, only have a user model and controller.
In the form  of edit a user, I add lock_version as a hidden field to the form, as the document recommended.

```ruby
 # schema.rb
ActiveRecord::Schema.define(version: 20170306092040) do
  create_table "users", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "lock_version"
  end
end

# model
class User < ApplicationRecord
end

# controller
class UsersController < ApplicationController
  def edit
  end

  def update
      if @user.update(user_params)
         redirect_to @user, notice: 'User was successfully updated.' 
      else
        render :edit 
    end
  end

    def user_params
      params.require(:user).permit(:name, :lock_version)
    end

end

# the edit view
<%= form_for(user) do |f| %>
  <%= f.hidden_field :lock_version %>

  <div class="field">
    <%= f.label :name %>
    <%= f.text_field :name %>
  </div>

  <div class="actions">
    <%= f.submit %>
  </div>
<% end %>

```
Then I open two page in browser both to edit the user and hit the update button
### Expected behavior
Only the first update is success, the second should raise a exception.

### Actual behavior
The second update success too.

### My preliminary explanation
The code below is the current version of rails 5.1.0.beta1
This line `return super if attribute_names.include?(lock_col)` cause the problem.
If I add a hidden field of lock version to a form, then the attribute_names will include the lock_verion column, so it will not  execute code after it.

```ruby
        def _update_record(attribute_names = self.attribute_names)
          return super unless locking_enabled?

          lock_col = self.class.locking_column

          return super if attribute_names.include?(lock_col)
          return 0 if attribute_names.empty?
         # other  code
end
```

### System configuration
**Rails version**:
5.1.0.beta1
**Ruby version**:
2.4.0
