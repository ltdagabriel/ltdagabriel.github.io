---
title: ActiveSupport::Timezone resets the timezone when calling round on the time
labels: activesupport
layout: issue
---

Let us say we have a time object of ActiveSupport::Timezone with the time set to the 1 hour transition period while switching from DST to normal time. When round method is called on that time, the timezone switches back to DST from non-DST. Following example illustrates the behaviour.

```
2.0.0-p0 :019 > Time.zone = "Europe/Paris"
 => "Europe/Paris"
2.0.0-p0 :020 > t1 = Time.zone.parse("2013-10-27 02:30:00")
 => Sun, 27 Oct 2013 02:30:00 CEST +02:00
2.0.0-p0 :021 > t2 = t1 + 1.hour
 => Sun, 27 Oct 2013 02:30:00 CET +01:00
2.0.0-p0 :022 > t2.round
 => Sun, 27 Oct 2013 02:30:00 CEST +02:00
2.0.0-p0 :023 >
```

I first thought it may be a Time.round bug and submitted to ruby-core. But looks like it must be ActiveSupport::Timezone issues.

https://bugs.ruby-lang.org/issues/9032

