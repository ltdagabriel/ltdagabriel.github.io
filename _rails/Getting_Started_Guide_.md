---
title: Getting Started Guide: 
labels: attached PR, docs
layout: issue
---

### Steps to reproduce
As in the start of the guide, change the article_edit view's form to like 
```ruby
<%= form_for(:post, url: post_path(@post), method: :patch) do |f| %>
```

Try to submit the edit form with the title length less than 5

### Expected behavior
On submitting the form the following error will be raised
ActionController::UrlGenerationError in Articles#update

the full traceback
```
ActionController::UrlGenerationError in Posts#update
Showing D:/SourceCodesAll/ruby/rails_starter/blog/app/views/posts/edit.erb where line #3 raised:

No route matches {:action=>"show", :controller=>"posts", :id=>nil} missing required keys: [:id]
Rails.root: D:/SourceCodesAll/ruby/rails_starter/blog

Application Trace | Framework Trace | Full Trace
app/views/posts/edit.erb:3:in `_app_views_posts_edit_erb__9863216_77879280'
app/controllers/posts_controller.rb:32:in `update'
Request

Parameters:

{"utf8"=>"✓",
 "_method"=>"patch",
 "authenticity_token"=>"S7tRNCapaUmzxi4w4B1i5/kV2aAya6GbpSF/40vMiwk1d7ONkw054I8mqk8ZV8XzDrdUFN9CW1bi/pxuvqNQfA==",
 "post"=>{"title"=>"erer",
 "body"=>"cgccgfg"},
 "commit"=>"Save Post",
 "id"=>"4"}
```

### Actual behavior
It should show the edit form again with error message that the title length should have length 5 or more

### System configuration
**Rails version**:
4.2.5.1
**Ruby version**:
2.2.0
