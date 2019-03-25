---
title: Deprecate ActionController::TestCase in favor of ActionDispatch::IntegrationTest
labels: actionpack
layout: issue
---

With the speed increase we achieved for ActionDispatch::IntegrationTest in Rails 5, there's no longer a need to also have ActionController::TestCase around. We're changing the scaffolds in #22076 but we should also get the message out that ActionController::TestCase is deprecated and will be made into a gem from Rails 5.1.

