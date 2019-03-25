---
title: URLs containing certain character codes break routing, DOS potential
labels: actionpack
layout: issue
---

1. Create an empty rails project (I'm using Rails 3.1.3), then uncomment the default "legacy" route in `config/routes.rb` so that there is at least one active route defined.
2. Fire up `rails server`
3. Now visit `http://localhost:3000/foo%E2%EF%BF%BD%A6`.

The result is an `ArgumentError`: "(invalid byte sequence in UTF-8)"

This may open up Rails sites which use email error notifications to DOS attacks via the repeated requesting of such URLs.

Note that this is a more general case of #4379, which I found affected action-cached URLs. Both that issue and this one were brought to my attention by Bingbot requesting these kinds of invalid URLs from my production Rails site, resulting in error emails.

