---
title: ActiveSupport::TimeZone.country_zones(country_code) fails to find valid Alpha2
labels: activesupport, attached PR
layout: issue
---

### Steps to reproduce
```
ActiveSupport::TimeZone.country_zones('GT')
ActiveSupport::TimeZone.country_zones('SV')
```
### Expected behavior
Guatemala and El Salvador share the same time zone ("Central America") and should return the same TZInfo response array.

### Actual behavior
```
ActiveSupport::TimeZone.country_zones('GT')
=> [#<ActiveSupport::TimeZone:0x007ff9f0c61c08 @name="Central America", @utc_offset=nil, @tzinfo=#<TZInfo::DataTimezone: America/Guatemala>>]
ActiveSupport::TimeZone.country_zones('SV')
=> []
```

### Cause
https://github.com/rails/rails/blob/master/activesupport/lib/active_support/values/time_zone.rb

The underlying reason seems to be that ActiveSupport::TimeZone::MAPPING is only a partial mapping of TZinfo identifiers: "Keys are Rails TimeZone names, values are TZInfo identifiers."   As a result, country_zones() will return the correct response only if a Rails TimeZone name is not shared by multiple countries.

### Version
ruby 2.3.3p222
activesupport (= 5.0.2)
tzinfo (1.2.2)
