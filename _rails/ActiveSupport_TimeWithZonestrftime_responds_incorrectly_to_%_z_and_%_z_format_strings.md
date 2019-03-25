---
title: ActiveSupport::TimeWithZone#strftime responds incorrectly to %:z and %::z format strings
labels: activesupport
layout: issue
---

**Environment : Ruby(MRI) 1.9.3-p194 and Rails 3.2.6**
#### Issue

ActiveRecord::TimeWithZone is supposed to be a drop in replacement for Ruby Time. 
Howerver [TimeWithZone#strftime](http://api.rubyonrails.org/classes/ActiveSupport/TimeWithZone.html#method-i-strftime) does not respond correctly to the **%:z and %::z format strings** as per the [Time#strftime documentation](http://www.ruby-doc.org/core-1.9.3/Time.html#method-i-strftime).  It loses the time offset information as shown below.
#### Test Case

``` ruby
irb> Time.zone = "Eastern Time (US & Canada)"
=> "Eastern Time (US & Canada)"
irb> twz = Time.zone.now
=> Wed, 04 Jul 2012 11:55:11 EDT -04:00
irb> twz.strftime('%z')
=> "-0400"
irb> twz.strftime('%:z')
=> "+00:00"
irb> twz.strftime('%::z')
=> "+00:00:00"
```

_Pairing with @dhakadamit_

