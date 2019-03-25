---
title: PendingMigrationError not outputting current environment
labels: activerecord
layout: issue
---

Using Pow, and running the latest rails/rails master.

`Migrations are pending run 'rake db:migrate RAILS_ENV=' to resolve the issue`

Within Pow, `ENV['RAILS_ENV']` isn't defined, but you can find the current environment with `Rails.env` instead. See #7951 for a more thorough discussion on the topic.

https://github.com/schneems/rails/blob/d741a4c6f863778c5ebf04b21f6c3292091c13a7/activerecord/lib/active_record/migration.rb#L37

@schneems, let me know and I can issue a pull request.

