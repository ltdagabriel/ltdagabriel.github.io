---
title: if a rendered resource is nil, rails defaults to template searching
labels: actionpack, actionview
layout: issue
---

``` ruby
  def create
    @user = nil
    respond_to do |format|
      format.html { render action: "new" }
      format.json { render json: @user, status: :unprocessable_entity }
      format.xml { render xml: @user, status: :unprocessable_entity}
    end
  end
```

The error:

``` ruby

  1) Error:
test_should_create_user(UsersControllerTest):
ActionView::MissingTemplate: Missing template users/create, application/create with {:locale=>[:en], :formats=>[:xml], :handlers=>[:erb, :builder, :coffee]}. Searched in:
  * "/Users/gnufied/railsyard/xml_bug/app/views"
```

I believe this is a bug and I see no reason why rails should not just render that nil value, as it used to in rails2. Thoughts?

/cc @jeremy 

