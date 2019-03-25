---
title: DateTime handling regression in 4.2.x
labels: activerecord, regression
layout: issue
---

It seems DateTime objects are no longer always handled correctly in 4.2.x, for example with those settings (on top of just the default ones for new apps):

``` ruby
config.time_zone = 'Berlin'
config.active_record.default_timezone = :local
```

And this table:

``` ruby
create_table :tests do |t|
  t.datetime :datetime
end
```

I get:

``` ruby
Test.where(datetime: 5.days.ago.to_datetime..DateTime.now).to_a
NoMethodError: undefined method `getlocal' for Sun, 28 Dec 2014 13:19:35 +0100:DateTime
        from /home/jarek/.rbenv/versions/2.1.5/lib/ruby/gems/2.1.0/gems/activerecord-4.2.0/lib/active_record/type/date_time.rb:14:in `type_cast_for_database'
...
```

The above works correctly in Rails 4.0.x and in Rails 4.1.x. It seems this commit by @sgrif introduced this issue:

https://github.com/rails/rails/commit/d5d734939864fa871daf8cef72b638aebf3b0f37

