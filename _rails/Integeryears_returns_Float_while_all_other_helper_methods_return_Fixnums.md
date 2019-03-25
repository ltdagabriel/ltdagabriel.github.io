---
title: Integer#years returns Float while all other helper methods return Fixnums
labels: activesupport, attached PR
layout: issue
---

Integer#years returns a `Float` while the rest of the accompanying methods return a `Fixnum`:

``` ruby
1.second       # => 1
1.minute       # => 60
1.hour         # => 3600
1.day          # => 86400
1.week         # => 604800
1.fortnight    # => 1209600
1.month        # => 2592000
1.year         # => 31557600.0
```

This being the result of:

``` ruby
def years
  ActiveSupport::Duration.new(self * 365.25.days, [[:years, self]])
end
```

Given that 365.25.days results to an integer (_31557600.0_), I was thinking that we could improve the consistency of the API by modifying the previous method to :

``` ruby
def years
  ActiveSupport::Duration.new(self * 365.25.days.to_i, [[:years, self]])
end
```

I would like to prepare a quick PR on this but I wanted first to take feedback in case I am missing something from previous discussions or someone can come up with a better way to handle this.

