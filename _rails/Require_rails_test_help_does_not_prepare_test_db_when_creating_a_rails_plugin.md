---
title: "Require rails/test_help" does not prepare test db when creating a rails plugin
labels: railties
layout: issue
---

Since 4.1 release, developers are now free from 'rake db:test:prepare'.
But when you create a rails plugin, still you need it,
although auto-generated test/test_helper.rb requires rails/test_help.
(To be precise,  "RAILS_ENV=test rake db:schema:load" seems recomended now, and as you know rails/test_help calls "ActiveRecord::Migration.maintain_test_schema!")

If you don't do it, you see an error like this

```
NoMethodError: undefined method `yaffle_text_field' for Hickwall(Table doesn't exist)
```

The reason why requiring rails/test_help doesn't work is activerecord/lib/active_record/migration.rb uses a relative path 'db/migrate' as its default migrations path. (around line 864)
So the solution seems to be one of them:
1. Have developers do 'db:schema:load' by themselves
2. Change auto-generated test/test_helper.rb of plugins to specify migrations_paths
3. Change active_record/migration.rb to  use Rails.root.join('db/migrate') when constant "Rails" is defined.

I was making a pull request with #2 approach on my laptop, but I thought I should ask your opinions first.
Thank you!

