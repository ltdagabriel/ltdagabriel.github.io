---
title: Delivering mail causes tests to fail
labels: actionmailer
layout: issue
---

### Steps to reproduce

```
rails new demo
cd demo
rails generate scaffold Order invoice:string
rails generate scaffold Cart
rails db:migrate
rails generate mailer OrderNotifier received shipped
edit app/controllers/orders_controller.rb
    >>> insert "OrderNotifierMailer.received.deliver_later"
rails test
```
- [Full log of scenario](http://intertwingly.net/tmp/aj_reload.html)
### Expected behavior

Tests should continue to pass
### Actual behavior

Tests fail
### System configuration

**Rails version**: `Rails 5.0.0.beta3` (https://github.com/rails/rails/commit/5bdeb9bfd72a97ad578efc6cce95283f589f1555)
**Ruby version**: `ruby 2.3.0p0 (2015-12-25 revision 53290) [x86_64-linux]`

```
5bdeb9bfd72a97ad578efc6cce95283f589f1555 is the first bad commit
commit 5bdeb9bfd72a97ad578efc6cce95283f589f1555
Author: Matthew Draper <matthew@trebex.net>
Date:   Fri Feb 26 16:17:01 2016 +1030

    Use AS::Reloader to support reloading in ActiveJob

:040000 040000 34118e38e533d6510538180ad80981099e50ffdc 27beb3711c94cf49845a9b05182c501dd864ee23 M  activejob
bisect run success
```

