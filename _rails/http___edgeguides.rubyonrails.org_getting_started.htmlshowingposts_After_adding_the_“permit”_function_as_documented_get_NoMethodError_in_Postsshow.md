---
title: http://edgeguides.rubyonrails.org/getting_started.html#showing-posts - After adding the “permit” function as documented get: NoMethodError in Posts#show
labels: docs
layout: issue
---

Showing D:/Dropbox/ECC/Technical/Scrape/blog/app/views/posts/show.html.erb where line #3 raised:
undefined method `title' for nil:NilClass

---

Fix is to move the private post_params method AFTER the show method, but this is not documented in the guide

