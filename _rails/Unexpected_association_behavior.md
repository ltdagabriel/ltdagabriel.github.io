---
title: Unexpected association behavior
labels: activerecord
layout: issue
---

Consider the following:

``` ruby
class Widget < ActiveRecord::Base
  has_many :things
end

widget = Widget.new
widget.things.build
widget.things.empty? # => true
widget.things
widget.things.empty? # => false
```

I'm assuming this is a bug and not intentional. But if it's intentional, it's unexpected behavior.

