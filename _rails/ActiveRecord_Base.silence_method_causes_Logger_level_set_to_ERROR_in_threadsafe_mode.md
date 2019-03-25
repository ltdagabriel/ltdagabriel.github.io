---
title: ActiveRecord::Base.silence method causes Logger level set to ERROR in thread-safe mode
labels: activerecord
layout: issue
---

This problem was found in Rails 2.3.5, which has silence method inside ActiveRecord::Base.
It looks like this method was moved into Benchmarkable on Rails trunk.

The Rails default Logger impl is not thread-safe to reset logger level. The silence method simply resets logger level could cause thread-safe problem.

ActiveRecord::Base.silence method is used inside session_store, to set, get and destroy session.
When Rails app is using Rails default SessionStore::Session to store session in database, this could cause the app only log ERROR level log.

Here is a test to prove it: https://github.com/xli/rails/commit/fc86c001af1032d09c4f8bbc2f3ff306966fbe4f

