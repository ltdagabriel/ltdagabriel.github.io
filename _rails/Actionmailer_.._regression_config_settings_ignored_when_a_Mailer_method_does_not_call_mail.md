---
title: Actionmailer 3.2.1 regression: config settings ignored when a Mailer method does not call "mail"
labels: actionmailer
layout: issue
---

When the method "mail" is not explicitely called from a Mailer method, the mail can still be delivered, but config settings (delivery method) are ignored.

This is unintuitive behavior and a regression from Rails 3.1.

Can be reproduced in Rails 3.2.1.

Example:

``` ruby
config.action_mailer.delivery_method = :sendmail
###
class Mailer < ActionMailer::Base
  def wrong
    headers[:to] = "xxx"
    headers[:from] = "yyy"
    headers[:subject] = "zzz"
  end

  def correct
    headers[:to] = "xxx"
    headers[:from] = "yyy"
    headers[:subject] = "zzz"
    mail
  end
end
###
Mailer.wrong.delivery_method
#=> SMTP

Mailer.correct.delivery_method
#=> Sendmail
```

