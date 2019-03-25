---
title: Rails 3.2.5 Regression: incorrect _changed? for datetimes
labels: activerecord, regression
layout: issue
---

I just upgraded from 3.2.2 to 3.2.5, and now I have failing specs. I've identified the problem as this. 

When you have this model: 

``` rails
  create_table "posts", :force => true do |t|
    t.string   "title"
    t.datetime "published_at"
  end
```

previously you could do: 

```
1.9.3p125 :013 >p = Post.last
1.9.3p125 :014 > p.published_at = p.published_at
1.9.3p125 :015 > p.changed?
=> false 
```

but now: 

```
1.9.3p125 :013 >p = Post.last
1.9.3p125 :014 > p.published_at = p.published_at
1.9.3p125 :015 > p.changed?
=> true 
1.9.3p125 :006 > p.changes
 => {"published_at"=>[Thu, 12 Apr 2012 19:32:33 UTC +00:00, Thu, 12 Apr 2012 19:32:33 UTC +00:00]} 
```

I'm going to see if I can put together a failing test around this. 

