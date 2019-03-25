---
title: objectify_options on custom form builders
labels: actionview
layout: issue
---

When creating a custom form builder by subclassing `ActionView::Helpers::FormBuilder`, objectify_options is not called on any of the option parameters in any methods defined unless the user specifically knows about this private method

For example, my own simple custom form builder used to look like this.

``` ruby
def text_field_dollar(attribute,html_options={})
      @template.content_tag(:div,
        @template.text_field(@object_name,attribute,html_options) +
        @template.content_tag(:div,"$",'style' =>'display:inline-block;margin-right:3px;vertical-align:middle;margin-top:4px;float:left;')
      )
end
```

The problem is that since `objectify_options` was not not called on the `html_options` variable, the "value" field (which when the form is called in an update action inside the controller would contain the value of the attribute in the model by default) wasn't being filled. To fix this, a user has to explicitly call `objectify_options` on the options variable

This workflow is both very DRY and obscure/confusing. `objectify_options` is only documented here (http://apidock.com/rails/ActionView/Helpers/FormBuilder/objectify_options) with no comments  and isn't mentioned anywhere else. Using the above as an example, one would look here https://github.com/rails/rails/blob/488699166c3558963fa82d4689a35f8c3fd93f47/actionpack/lib/action_view/helpers/form_helper.rb#L689, and in that source there is no mention of using objectify_options, nor is it being called.

tl;dr It is not obvious (even in the slightest) that a user has to use objectify_options on the options parameter to mimic the default form builders methods when creating their own form builder methods.

Either the documentation needs to make this very clear, or this behavior should be automatic when using custom form builders by subclassing `ActionView::Helpers::FormBuilder`

