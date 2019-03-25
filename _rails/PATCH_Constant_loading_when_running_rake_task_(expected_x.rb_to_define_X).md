---
title: [PATCH] Constant loading when running rake task (expected x.rb to define X)
labels: railties
layout: issue
---

_Imported from Lighthouse._ Original ticket at: http://rails.lighthouseapp.com/projects/8994/tickets/6493
Created by **Ludo van den Boom** - 2011-03-01 15:23:06 UTC

Copied most of the info from ticket #5074. The problem I encounter is the same as in that ticket, except I don't have issues with rails console (that has already been resolved in ticket #5074), but with running rake tasks. Attached patch resolves this issue for rake tasks as well.

**Versions used**

I am using Ruby 1.8.7 and Rails 3.0.5

**Steps to reproduce**

1) rails new foo
2) cd foo
3) rails generate model bar
4) rails generate observer bar
5) rake db:migrate
6) in config/application.rb file:

``` ruby
config.active_record.observers = :bar_observer
```

6) touch lib/tasks/qux.rake
7) in lib/tasks/qux.rake:

``` ruby
desc "Qux"
task :qux => :environment do
  Bar
end
```

8) rake qux

Results in an error:

``` ruby
Expected /Users/ludo/src/foo/app/models/bar.rb to define Bar
```

