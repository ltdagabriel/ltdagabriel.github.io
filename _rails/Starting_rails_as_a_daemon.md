---
title: Starting rails 5 as a daemon
labels: With reproduction steps, attached PR, regression
layout: issue
---

I create new rails app and try to run it with `-d` option

```
rails _5.0.0.beta1_ new example_app -G -d sqlite3
cd example_app
./bin/rails server -d
```

Output:

```
=> Booting Puma
=> Rails 5.0.0.beta1 application starting in development on http://localhost:3000
=> Run `rails server -h` for more startup options
I, [2015-12-28T16:56:38.914107 #54996]  INFO -- : Celluloid 0.17.2 is running in BACKPORTED mode. [ http://git.io/vJf3J ]
```

From log file:

```
DEPRECATION WARNING: alias_method_chain is deprecated. Please, use Module#prepend instead. From module, you can access the original method using super. (called from block in tsort_each at /Users/pavel/.rbenv/versions/2.2.3/lib/ruby/2.2.0/tsort.rb:226)
DEPRECATION WARNING: before_filter is deprecated and will be removed in Rails 5.1. Use before_action instead. (called from <top (required)> at /Sites/example_app/app/controllers/application_controller.rb:1)
DEPRECATION WARNING: after_filter is deprecated and will be removed in Rails 5.1. Use after_action instead. (called from <top (required)> at /Sites/example_app/app/controllers/application_controller.rb:1)
DEPRECATION WARNING: alias_method_chain is deprecated. Please, use Module#prepend instead. From module, you can access the original method using super. (called from block in tsort_each at /Users/pavel/.rbenv/versions/2.2.3/lib/ruby/2.2.0/tsort.rb:226)
DEPRECATION WARNING: before_filter is deprecated and will be removed in Rails 5.1. Use before_action instead. (called from <top (required)> at /Sites/example_app/app/controllers/application_controller.rb:1)
DEPRECATION WARNING: after_filter is deprecated and will be removed in Rails 5.1. Use after_action instead. (called from <top (required)> at /Sites/example_app/app/controllers/application_controller.rb:1)
Couldn't cleanly terminate all actors in 10 seconds!
```

When running without `-d` it works just fine

