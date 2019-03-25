---
title: `validates_uniqueness_of` and `accepts_nested_attributes_for` only validates existing records
labels: activerecord
layout: issue
---

If I have a nested model, such as:

``` ruby
class Contact < ActiveRecord::Base
  belongs_to :group

  validates_uniqueness_of :phone, :scope => [:group_id]
end
```

``` ruby
class Group < ActiveRecord::Base
  has_many :contacts

  accepts_nested_attributes_for :contacts
end
```

The uniqueness validator only applies to existing records in the database... If I submit the same duplicate record as a nested attribute:

``` javascript
{
  "group"  => {
    "name" => "Blah",
    "description" => "Foot",
    "contacts_attributes" => {
      "0" => {
        "id" => "5",
        "name" => "Seth Vargo",
        "phone"=>"1234567890"
      },
        "1" => {
          "id" => "6",
          "name" => "Person B",
          "phone"=>"1234567890"
      },
        "2" => {
          "name" => "Person C",
          "phone" => "1234567890"
        }
      }
   }
}
```

It will add all those records, even though the `phone` is supposed to be unique...

