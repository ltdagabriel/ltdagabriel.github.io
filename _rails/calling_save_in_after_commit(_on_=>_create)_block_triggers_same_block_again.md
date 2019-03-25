---
title: calling save in after_commit(:on => :create) block triggers same block again
labels: activerecord
layout: issue
---

Following code:

``` ruby
class User < ActiveRecord::Base
  attr_accessible :name
  after_commit :cache_user, :on => :create

  def cache_user
    puts "Caching user"
    self.cached = true
    self.save
  end
end
```

triggers same `cache_user` method again when `save` gets called from `cache_user` method. I believe, calling `save` from `after_commit(:on => :create)` hook should ideally only trigger if there is a `after_commit(:on => :update)` callback is registered.
The reason this is happening is - recorded transaction states get cleared only after `after_commit` callback returns, whereas I believe this bug can be fixed by clearing transaction state before entering `after_commit` callback. 

