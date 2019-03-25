---
title: Wrong table name generated for HABTM association
labels: activerecord
layout: issue
---

``` ruby
class CreateAccess < ActiveRecord::Migration
  def change
    create_table :access_roles do |t|
      t.string :name
    end

    create_table :access_rights do |t|
      t.string :name
    end

    create_table :access_rights_access_roles do |t|
      t.belongs_to :access_right
      t.belongs_to :access_role
    end
  end
end


class AccessRole < ActiveRecord::Base
has_and_belongs_to_many :access_rights
end

class AccessRight < ActiveRecord::Base
has_and_belongs_to_many :access_roles
end
```

```
> rails console
Loading development environment (Rails 4.0.0.beta1)
2.0.0-p0 :001 > f = AccessRole.create(name: 'Fred')
   (0.1ms)  begin transaction
  SQL (0.3ms)  INSERT INTO "access_roles" ("name") VALUES (?)  [["name", "Fred"]]
   (2.8ms)  commit transaction
 => #<AccessRole id: 1, name: "Fred"> 
2.0.0-p0 :002 > w = AccessRight.create(name: 'Wilma')
   (0.1ms)  begin transaction
  SQL (0.3ms)  INSERT INTO "access_rights" ("name") VALUES (?)  [["name", "Wilma"]]
   (2.8ms)  commit transaction
 => #<AccessRight id: 1, name: "Wilma"> 
2.0.0-p0 :003 > f.access_rights < w
ActiveRecord::StatementInvalid: Could not find table 'access_rights_roles'    <== Should be 'access_rights_access_roles'
```

