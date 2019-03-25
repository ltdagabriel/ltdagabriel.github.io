---
title: Time is created in UTC with local time
labels: activerecord
layout: issue
---

When a Model is created using the mass assignment, and the model has a time attribute.

The Time attribute is created in local time but with UTC time zone even with config.time_zone properly setted.

I was studying this wrong behavior and guess that the error is here:

https://github.com/rails/rails/blob/master/activerecord/lib/active_record/attribute_methods/time_zone_conversion.rb#L62

As you can see, in the line 62 it only consider :datetime and :timestamp. it does not consider :time to be timezone aware.

