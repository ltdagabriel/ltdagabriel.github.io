---
title: Validating presence of parent in polymorphic association with nested attributes
labels: activerecord
layout: issue
---

Taking the following classes:

``` ruby
class User < ActiveRecord::Base
  has_one :address, :as => :addressable
  accepts_nested_attributes_for :address
end

class Address < ActiveRecord::Base
  belongs_to :addressable, :polymorphic => true
  validates_presence_of :addressable
end
```

Now when creating a new User (with fields_for :address), no records will be saved as the validation on Address will fail with `address.addressable can't be blank`.

On a non-polymorphic relationship, the solution to this is to use :inverse_of in the User model, eg: `has_one :address, :inverse_of => :user`. However :inverse_of does not currently support polymorphic relationships, so this is not an option.

