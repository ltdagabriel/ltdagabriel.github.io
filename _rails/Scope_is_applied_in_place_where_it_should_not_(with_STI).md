---
title: Scope is applied in place where it should not (with STI)
labels: activerecord, openacademy
layout: issue
---

After upgrading from 4.0.0 to 4.0.2 some of the scopes behave incorrectly IMHO

For example, if i have class hierarchy:

``` ruby
class User < ActiveRecord::Base
  belongs_to :role
end

class Term < ActiveRecord::Base
end

class Role < Term
end

class ProductCategory < Term

   belongs_to :realm, class_name: 'Role'

   scope :view_as_realm, -> {
        where realm: user.role

    }

end
```

Problem is that the code in the scope

``` ruby
user.role
```

is executed incorrectly,
when executing user.realm , Rails adds the scope to the SQL Query, like

``` sql
SELECT `terms`.* FROM `terms` WHERE `terms`.`type` IN ('ProductCategory') AND `terms`.`type` IN ('Role') AND `terms`.`id` = 193 ORDER BY `terms`.`id` ASC LIMIT 1
```

which makes no sense (as it added  WHERE `terms`.`type` IN ('ProductCategory')  to querying absolutely other model !)

to overcome the problem i had to modify the code like:

``` ruby
unscoped {
   user.role    
 }
```

and then it works as expected

This appears in 4.0.2, 4.0.0 works correctly with this

