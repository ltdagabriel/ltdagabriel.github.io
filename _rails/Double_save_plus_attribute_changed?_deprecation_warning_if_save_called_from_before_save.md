---
title: Double save plus attribute_changed? deprecation warning if save called from before_save
labels: activerecord, attached PR
layout: issue
---

### Steps to reproduce

I have the following app

```ruby
class Order < ApplicationRecord
  has_many :details
  validate :validate_name, if: lambda { |obj| obj.name_changed? }

  def validate_name
    puts "validate_name"
  end
end

class Detail < ApplicationRecord
  belongs_to :order
  before_save :update_order

  def update_order
    order.name += ' (updated)'
    order.save
  end
end
```

(As you can see, `Detail#save` can be called from the before_save callback since `Order#save` saves its children.)

Now, do

```ruby
o = Order.create! name: 'An order'
o.details.create!
```

### Expected behavior
I expect this to work without deprecation warnings.

### Actual behavior
I'm getting a deprecation warning that suggest the behavior of `attribute_changed?` changed from inside after callbacks, but this is not inside one (I could of course not use the deprecation warning's suggested fix of changing to `saved_change_to_attribute?` since it's not saved yet).

> DEPRECATION WARNING: The behavior of `attribute_changed?` inside of after callbacks will be changing in the next version of Rails. The new return value will reflect the behavior of calling the method after `save` returned (e.g. the opposite of what it returns now). To maintain the current behavior, use `saved_change_to_attribute?` instead. (called from block in <class:MyModel> at /Users/magnus/Code/rails_test/api/app/models/my_model.rb:2)

### System configuration
**Rails version**: 5.1.0.rc1 and master

**Ruby version**: 2.4.1

