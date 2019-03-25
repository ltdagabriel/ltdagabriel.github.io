---
title: Activerecord Enum Symbol Matching Behavior
labels: activerecord, enum
layout: issue
---

While working to upgrade an app, I came across this subtle breaking change in behavior. ActiveRecord seems to be no longer matching symbols and applying the integers. (There also seems to be some inconstancy on how the Enum is handled with where statements.)

To me one of the big wins was/is that Enums are handled transparently. I should be able to pass a symbol or a string to ActiveRecord, and it should solve to the corresponding integer. 

``` ruby
class Thing < ActiveRecord::Base
  enum state: [:working, :broken]
end
```

``` ruby
#4.1.8
irb(main):001:0> Thing.create(state: :broken)
   (0.1ms)  begin transaction
  SQL (0.3ms)  INSERT INTO "things" ("created_at", "state", "updated_at") VALUES (?, ?, ?)  [["created_at", "2015-01-07 15:05:29.952177"], ["state", 1], ["updated_at", "2015-01-07 15:05:29.952177"]]
   (1.4ms)  commit transaction
=> #<Thing id: 1, state: 1, created_at: "2015-01-07 15:05:29", updated_at: "2015-01-07 15:05:29">
```

``` ruby
#4.2.0
irb(main):001:0> Thing.create(state: :broken)
   (0.1ms)  begin transaction
  SQL (0.5ms)  INSERT INTO "things" ("created_at", "updated_at") VALUES (?, ?)  [["created_at", "2015-01-07 15:18:12.457901"], ["updated_at", "2015-01-07 15:18:12.457901"]]
   (1.2ms)  commit transaction
=> #<Thing id: 1, state: nil, created_at: "2015-01-07 15:18:12", updated_at: "2015-01-07 15:18:12">
```

