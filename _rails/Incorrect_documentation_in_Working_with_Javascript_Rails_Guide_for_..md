---
title: Incorrect documentation in "Working with Javascript" Rails Guide  for 5.1
labels: docs
layout: issue
---

### Steps to reproduce
Try to setup a callback handler for remote forms with rails 5.1 by referencing the rails guide "Working with Javascript in Rails" for rails 5.1.

### Expected behavior
The guide for rails 5.1 should document the changes that were introduced in 5.1 :)

### Actual behavior
[http://guides.rubyonrails.org/v5.1/working_with_javascript_in_rails.html#remote-elements](http://guides.rubyonrails.org/v5.1/working_with_javascript_in_rails.html#remote-elements) still references the old method signagures for ajax:* callbacks. After tons of debugging, I checked the guide for version 5.2 and it states in [http://guides.rubyonrails.org/v5.2/working_with_javascript_in_rails.html#rails-ujs-event-handlers](http://guides.rubyonrails.org/v5.2/working_with_javascript_in_rails.html#rails-ujs-event-handlers) that the callback signatures have changed in 5.1, and [http://guides.rubyonrails.org/v5.2/working_with_javascript_in_rails.html#rails-ujs-event-handlers](http://guides.rubyonrails.org/v5.2/working_with_javascript_in_rails.html#rails-ujs-event-handlers) does document the new signatures.

