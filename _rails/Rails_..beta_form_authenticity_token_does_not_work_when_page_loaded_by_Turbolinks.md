---
title: Rails 5.0.0beta3: form authenticity_token does not work when page loaded by Turbolinks
labels: actionpack, attached PR
layout: issue
---

I have a simple Rails 5.0.0beta3 app with a simple form to create a record. Default configuration and environment in development.

> <%= form_for @node, url: admin_book_nodes_url, as: :node do |form| %>
> <%= render "form", f: form %>
> 
> <p><%= form.submit %> or <%= link_to "Cancel", admin_book_nodes_path %></p>
> 
> <% end %>

When the form is loaded through a link on another page of the app, on submission a `ActionController::InvalidAuthenticityToken` is generated.

> 'Started POST "/admin/book/nodes" for ::1 at 2016-03-20 11:54:31 +0000
> Processing by Admin::Book::NodesController#create as HTML
>   Parameters: {"utf8"=>"✓", "authenticity_token"=>"/G5pF6hSPx0Vf21Fi0FCh+VlOcHY4w8C5lmHmwr3NQRjfXUP9/xboybeV3tevmyTyHcwSX8LplU/HgZVGDbGlw==", "node"=>{"parent_id"=>"1", "position"=>"1", "title"=>"lkjlkj", "description"=>"lkjlj", "published"=>"0", "content"=>"lkjlkj"}, "commit"=>"Create node"}
> Can't verify CSRF token authenticity
> Completed 422 Unprocessable Entity in 1ms (ActiveRecord: 0.0ms)'

However if the form page is manually reload before being filled then everything works fine. The behaviour is the same with both Safari and Chrome.

What I have noticed:
- When the form is loaded from a link on another page (failure case), it is loaded by Turbolinks through an XHR request. In such case the page authenticity token in `csrf_meta_tags` and the form's token in `authenticity_token` have different values.
- When the form is loaded or reloaded by the browser (successful case), so not by Turbolinks the tokens in  in `csrf_meta_tags` and the form's `authenticity_token` are the same.

Disabling Turbolinks specifically for the link to the form (e.g. `<a data-turbolinks="false" href="/admin/book/nodes/new">New node</a>`) will also prevent the issue.

It does not seem the same as [#23524](https://github.com/rails/rails/issues/23524), but perhaps it is related.

Note also my submission on [Stackoverflow](http://stackoverflow.com/questions/36112939/rails-5-0-0beta3-actioncontrollerinvalidauthenticitytoken-in-development).

