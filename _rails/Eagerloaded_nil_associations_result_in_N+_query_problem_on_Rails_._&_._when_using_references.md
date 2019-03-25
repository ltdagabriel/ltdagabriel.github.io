---
title: Eager-loaded nil associations result in N+1 query problem on Rails 4.1 & 4.2 when using `references`
labels: activerecord
layout: issue
---

Suppose you have

``` ruby
class Season < ActiveRecord::Base
  belongs_to :division
  has_one :champion
end

class Division < ActiveRecord::Base
end

class Champion < ActiveRecord::Base
end
```

Then we have this code that uses it:

``` ruby
seasons = Season.includes(:division, :champion).references(:champion)
seasons.each{|s| puts s.champion.inspect }
```

This will run a query for each `champion` if `champion` is `nil` starting in Rails 4.1.

If you remove the call to `references` however, it behaves as expected.

