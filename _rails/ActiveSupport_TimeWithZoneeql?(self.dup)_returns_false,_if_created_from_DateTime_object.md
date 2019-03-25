---
title: ActiveSupport::TimeWithZone#eql?(self.dup) returns false, if created from DateTime object
labels: With reproduction steps, activesupport
layout: issue
---

When creating an `ActiveSupport::TimeWithZone` from a `DateTime` object like so, I expect `#eql?` to return true:

```
2.1-head :001 > n = DateTime.now.in_time_zone
=> Mon, 24 Feb 2014 12:33:43 UTC +00:00
2.1-head :002 > n.eql? n.dup
 => false
```

Here is the faulty code in `ActiveSupport::TimeWithZone#eql?`:

```
def eql?(other)
  utc.eql?(other)
end
```

`#utc` returns the original DateTime object, whose `#eql?` cannot handle a comparison with an `ActiveSupport::TimeWithZone` correctly.

This is bad for example in Hash merging, because comparison of Hash keys is done with `#eql?`:

```
2.1-head :009 > h1 = { n => 1 }; h2 = { n.dup => 2 }
2.1-head :010 > h1.merge h2
# Expecting a Hash with a single key here with the value 2:
 => {Mon, 24 Feb 2014 13:23:24 UTC +00:00=>1, Mon, 24 Feb 2014 13:23:24 UTC +00:00=>2} 
```

However, if the `ActiveSupport::TimeWithZone` object is created from a `Time` object instead of from a `DateTime` object, the code works as expected:

```
2.1-head :004 > n = Time.now.in_time_zone
 => Mon, 24 Feb 2014 13:07:37 UTC +00:00 
2.1-head :005 > n.eql? n.dup
 => true 
```

The issue occurs in Rails 4.0.3, Rails 4.1.0. rc, and on Ruby versions 2.1-head as well as 2.0.0. It was mentioned in #3431, but not solved.

