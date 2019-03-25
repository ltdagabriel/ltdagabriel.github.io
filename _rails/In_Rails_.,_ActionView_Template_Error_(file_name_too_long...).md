---
title: In Rails 3.1, ActionView::Template::Error (file name too long...)
labels: asset pipeline
layout: issue
---

I'm getting an error in production. It's similar to #138. It's happening only in production, not in development.

In my point of view, I did nothing that could cause the error. It was working fine, then I improved my tests, refactored a JS file today and redeployed.
# The problem

 Now I get this:

```
ActionView::Template::Error (File name too long - /var/rails/primero/releases/20111017013943/app/assets/images/form .columns {
  display: table;
  clear: both;
  margin: 0 0 10px 0; }

input:focus {
  background: #f1f1f1;

(...almost whole css file is output...)

/* inline_form FORMS *):
    2: <html>
    3: <head>
    4:      <title><%= @company_name %><%= if yield(:title).blank?; ""; else ": "+yield(:title); end %></title>
    5:      <%= stylesheet_link_tag "manifest_application" %>
    6:  <%= javascript_include_tag "manifest_application" %>
    7:  
    8:  <% # params[:controller] = 'deals'; %>
  app/views/layouts/application.html.erb:5:in `_app_views_layouts_application_html_erb___561691512_94090930'
```

The whole log is here: http://pastie.org/2709138

Upon deployment, I'm running assets:precompile (via capistrano). Everything was fine yesterday.
# What I did trying to solve
- I commented line 5 (loading css), and the error went to the line 6 (js).
- Gemfile: `gem 'sprockets', :git => 'https://github.com/sstephenson/sprockets.git'`
- Deployed from another branch, which has code from 2 days ago, and everything started working again. I presume something's wrong with my code, but I really did nothing, just refactored a JS file (and created some RSpec specs). How could source code throw in error 'file name too long'?

Have no clue what else I could do.
# My environment

``` ruby
# environments/production.rb

config.serve_static_assets = false
config.assets.compile = true
config.assets.digest = true
```

So, could anyone help me? I found nothing similar on Google, only #138 (which is not an ActionView::Template error).

