---
title: Rails uniqueness validator incorrectly checks previous record.
labels: activerecord, attached PR
layout: issue
---

The Rails uniqueness validator performs it's query based on the current value of the id attribute as opposed to the original value of id (id_was).  This leads to an error condition when you allow the user to update the id itself.  

Example:

Migration: 

```
class CreateOrganizations < ActiveRecord::Migration
  def change
    create_table :organizations, id: false do |t|
      t.integer :id, primary_key: true
      t.string :name

      t.timestamps null: false
    end
  end
end
```

Model:

```
class Organization < ActiveRecord::Base
  validates :id, presence: true, uniqueness: true
  validates :name, presence: true, uniqueness: true
end
```

Code:

```
o1 = Organization.create!(id: 1, name: "Org 1")
o2 = Organization.create!(id: 2, name: "Org 2")

o1.id = o2.id

o1.save!
```

In the above example, you should get a validation error on ID, instead you get it on name because Rails generates the query based on the newly assigned id of 2 instead of the original id of 1

`SELECT  1 AS one FROM "organizations" WHERE ("organizations"."name" = 'Org 1' AND "organizations"."id" != 2) LIMIT 1`

Error reproduced successfully in 4.2.5, haven't tried 5.0 beta yet.

