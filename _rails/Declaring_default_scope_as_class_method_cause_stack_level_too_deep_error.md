---
title: Declaring default_scope as class_method cause stack level too deep error
labels: activerecord
layout: issue
---

Given the following model:

``` ruby
class Manufacturer < ActiveRecord::Base
  scope :visible, where(:visible => true)
  def self.default_scope
    visible
  end
end
```

then trying to create a model raises an error:

```
>> Manufacturer.create!(:name => 'Yonex')
SystemStackError: stack level too deep
```

Defining the default_scope as `default_scope visible` doesn't raise an error. Isn't a regression as defining default scope as a class method is new to 3.1 however I'd consider it a blocker.

