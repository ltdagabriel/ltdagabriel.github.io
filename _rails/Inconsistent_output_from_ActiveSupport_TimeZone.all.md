---
title: Inconsistent output from ActiveSupport::TimeZone.all
labels: activesupport, attached PR, pinned
layout: issue
---

Due to caching, `ActiveSupport::TimeZone.all` returns different results if a non-ActiveSupport-supported zone was looked up first. 

```
ActiveSupport::TimeZone.all
# not in ActiveSupport::TimeZone::MAPPING, but still a valid zone
chicago = ActiveSupport::TimeZone['America/Chicago']
ActiveSupport::TimeZone.all.include?(chicago)
=> false
```

```
chicago = ActiveSupport::TimeZone['America/Chicago']
ActiveSupport::TimeZone.all.include?(chicago)
=> true
```

This affects `time_zone_options_for_select`, in that the `selected` arg of that function is a string matched to the names of zones in `ActiveSupport::TimeZone.all`. If your app stores timezones in TZInfo format, the helper may not generate an option tag for a recognized zone.

I see two ways around this:
1. Change the helper to recognize TZInfo identifiers
2. Update the zones cache when lazy-loading time zones.

Changing the helper might unintentionally change your data ("America/Chicago" would get converted to "Central Time"). It seems like Rails is opinionated about what zones it wants to use, so that might not be a big deal. The second approach avoids that problem, but still requires you to look up the alternate zone before it shows up in the list.

Thoughts?

