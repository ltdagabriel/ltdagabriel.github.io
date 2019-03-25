---
title: Default scope includes(:association) is ignored
labels: activerecord, regression
layout: issue
---

Given the following models:

``` ruby
class Menu < ActiveRecord::Base
  has_many :links, :as => :owner
  default_scope includes(:links)
end

class Link < ActiveRecord::Base
  belongs_to :menu, :polymorphic => true
end
```

then doing a `Menu.first` doesn't load the links. Pretty sure this is a regression from 3.0.x. There's a related issue with has_many :through as well where it tries to execute the default scope but can't find the association reflection. I'll add some more details later and provide some failing tests.

