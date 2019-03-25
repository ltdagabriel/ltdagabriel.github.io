---
title: Allow Range including DateTime and DateTime::Infinity
labels: activesupport
layout: issue
---

With activesupport-3.2.8, picking only the DateTime conversions:

``` ruby
1.9.3p327 :002 >   require 'active_support/core_ext/date_time/conversions'
 => true 
1.9.3p327 :003 > DateTime::Infinity.new..DateTime::Infinity.new
 => #<Date::Infinity:0x8465944 @d=1>..#<Date::Infinity:0x8465930 @d=1> 
1.9.3p327 :004 > DateTime.new..DateTime::Infinity.new
ArgumentError: bad value for range
    from (irb):4
    from /home/lars/.rvm/rubies/ruby-1.9.3-p327/bin/irb:16:in `<main>'
```

Expected:

``` ruby
1.9.3p327 :001 > require 'active_support'
 => true 
1.9.3p327 :002 > DateTime::Infinity.new..DateTime::Infinity.new
 => #<Date::Infinity:0x8e9d2e0 @d=1>..#<Date::Infinity:0x8e9d2b8 @d=1> 
1.9.3p327 :003 > DateTime.new..DateTime::Infinity.new
 => #<DateTime: -4712-01-01T00:00:00+00:00 ((0j,0s,0n),+0s,2299161j)>..#<Date::Infinity:0x90c8f88 @d=1> 
```

