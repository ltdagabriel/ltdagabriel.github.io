---
title: Database objects do not register < 1sec changes
labels: activerecord
layout: issue
---

I just upgraded from rails 3.1.3 to rails 3.2.9

It seems database objects that keep track of postgres DateTime objects do not register changes under 1 second

``` ruby
1.9.3-p327 :001 > e = Employee.last
1.9.3-p327 :002 > e.created_at
 => Wed, 14 Nov 2012 11:43:18 PST -08:00
1.9.3-p327 :003 > e.created_at.to_f
 => 1352922198.0550148
1.9.3-p327 :004 > e.created_at += 0.5
 => Wed, 14 Nov 2012 11:43:18 PST -08:00
1.9.3-p327 :006 > e.changed?
 => false
1.9.3-p327 :007 > e.created_at.to_f
 => 1352922198.0550148
1.9.3-p327 :008 > e.created_at += 0.95
 => Wed, 14 Nov 2012 11:43:19 PST -08:00
1.9.3-p327 :009 > e.changed?
 => true
1.9.3-p327 :010 > e.created_at.to_f
 => 1352922199.0050151
1.9.3-p327 :011 > e.created_at.class
 => ActiveSupport::TimeWithZone
```

However less than 1 second changes to time objects in rails 3.1.3 worked as expected.

