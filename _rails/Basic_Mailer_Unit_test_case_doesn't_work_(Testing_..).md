---
title: Basic Mailer Unit test case doesn't work (Testing 10.2.2)
labels: actionmailer, docs
layout: issue
---

If you implement an ActionMailer using the documentation (action_mailer_basics.html) and implement the basic test case in testing.html section 10.2.2, the test case will fail because the Message-ID headers of the expected and generated message do not match. The documentation doesn't currently explain how to work around this issue.

