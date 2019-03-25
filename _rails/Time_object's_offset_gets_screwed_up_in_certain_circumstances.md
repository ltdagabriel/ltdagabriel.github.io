---
title: Time object's offset gets screwed up in certain circumstances
labels: activesupport
layout: issue
---

Ruby's `Time#getlocal` takes a UTC offset and returns a time object with an adjusted UTC offset (but no named zone). Such objects have funny behavior in the following circumstances when interacting with ActiveSupport functionality

`+` method:

``` ruby
> Time.parse("2012-01-01T00:00Z").getlocal("-08:00") # normal
=> 2011-12-31 16:00:00 -0800
> Time.parse("2012-01-01T00:00Z").getlocal("-08:00") + 0 # normal
=> 2011-12-31 16:00:00 -0800
> Time.parse("2012-01-01T00:00Z").getlocal("-08:00") + 0.days # wtf
=> 2011-12-31 16:00:00 -0500
```

`change` method:

``` ruby
> Time.parse("2012-01-01T00:00Z").getlocal("-08:00") # normal
=> 2011-12-31 16:00:00 -0800
> Time.parse("2012-01-01T00:00Z").getlocal("-08:00").change(:min => 59) # wtf
=> 2011-12-31 16:59:00 -0500
```

