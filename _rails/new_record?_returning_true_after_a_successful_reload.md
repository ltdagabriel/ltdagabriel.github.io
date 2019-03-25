---
title: new_record? returning true after a successful reload
labels: activerecord, attached PR
layout: issue
---

Hello,

The documentation of new_record? states

> Returns true if this object hasn’t been saved yet – _that is, a record for the object doesn’t exist in the data store yet_; otherwise, returns false.

However when reload is called successfully it should mean that there is an object in the datastore, yet new_record? still returns true.

Simple case to recreate situation

``` ruby
Person = Person.new
# some processing to find out that we already have the item in the datastore
# e.g nested_attribute contains id
person.id = Item.first.id #could also use person.id = known_id
person.reload
person.new_record? # returns true, even if the reload worked
```

Code that's failing on me

``` ruby
class Person < ActiveRecord::Base
 has_many :items, -> { uniq }, dependent: :destroy
 accepts_nested_attributes_for :items
 attr_accessible :name, :items, :items_attributes

 protected
  def items_attributes=(attributes)
   #Code truncated
   # After checks for existence of items in db by either item.code or item.id
   self.id = id_from_first_item_attribute
   self.reload
   # Assign new attributes
  end
end

class Item < ActiveRecord::Base
 belongs_to :people
 attr_accessible :code
 validates :code, uniqueness: true
end

params = { items_attributes: [ { code: "A97G1A"} ]}
p = Person.new params
p.new_record? # true
#p.save will create a new record
```

Is this desired behavior? If so could you please update the documentation? If not, then could you please make @new_record somehow dependent on reload or really do what it says in the documentation?

Kind regards,
LoveIsGrief

