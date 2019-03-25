---
title: Rake Tasks test:all does not execute when invoked
labels: railties
layout: issue
---

When making or extending a rake task the Rails::TestTask is not executing when invoked.  It looks like it depends on the minitest at_exit handler to call the tests.  This means when you want to run a task after tests you cannot do this with prerequisites.

``` ruby
task test: %w[test:all rubocop]
```

this code will execute rubocop first.

ping: @drbrain

reference issues.
https://github.com/bbatsov/rubocop/issues/1455
https://github.com/jimweirich/rake/issues/385

