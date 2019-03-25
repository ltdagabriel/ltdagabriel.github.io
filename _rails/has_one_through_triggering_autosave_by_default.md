---
title: has_one through triggering autosave by default
labels: activerecord, attached PR
layout: issue
---

I found the strangest issue by activerecord (3.2.12, not sure how that works in 4). Basically I have the following set this way:

``` ruby
class Bing < ActiveRecord::Base
  belongs_to :bang
  has_one :bong, :through => :bang
end
```

All is well, until I persist an instance of Bing. If I keep updating it, the bong association is also saved, or autosaved. Only after I explicitly set a flag :autosave => false on the association it stopped. So, the has_one through association is autosavable by default(!), which looks like a bug to me. 

I went so far as debugging it all the way to a method in autosave_association called save_has_one_association, where the option[:autosave] is nil. And nil != false (line 390). I don't know if that is the reason and autosave should be false by default instead of nil. Maybe you can tell me.

I didn't test it with has_many through relations. 

