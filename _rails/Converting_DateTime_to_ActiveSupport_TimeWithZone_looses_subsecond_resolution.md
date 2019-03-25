---
title: Converting DateTime to ActiveSupport::TimeWithZone looses sub-second resolution
labels: activesupport
layout: issue
---

``` ruby
dt = DateTime.now
dt.sec_fraction # => (12345/1000000)
dt.in_time_zone #=> "Wed, 05....."
dt.in_time_zone.usec #=> 0
```

I believe that this is because the [`ActiveRecord::TimeWithZone#usec`](https://github.com/rails/rails/blob/master/activesupport/lib/active_support/time_with_zone.rb#L303) method assumes that the `utc_time` value passed to the constructor will be a `Time` object, instead of a `DateTime` object.  The creation of the `AR::TWZ` in [`DateTime#in_time_zone`](https://github.com/rails/rails/blob/master/activesupport/lib/active_support/core_ext/date_time/zones.rb#L20), however, passes in the `DateTime` object as `utc_time`.

This is a huge issue for us, as this seems to be the code path for storing records into `datetime` columns (sqlite, at least) and we are loosing our sub-second resolution for records stored in the DB. 

