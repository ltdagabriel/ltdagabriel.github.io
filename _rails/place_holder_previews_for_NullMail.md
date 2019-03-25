---
title: place holder previews for NullMail
labels: actionmailer
layout: issue
---

The mailer previews that arrived in rails 4.1 should do something sensible (i.e. render some informative message) when they encounter a `ActionMailer::Base::NullMail` at the moment they result in an error because nil data is encountered.

