---
title: Unable to access private/protected methods from a Scope
labels: activerecord
layout: issue
---

Looking at upgrading my current 5.1.5 Rails application, to the 5.2. I noticed this little bug that is plaguing my application from going forward.

Public methods do not appear to have this problem.

### Steps to reproduce
Example:
```Ruby
class User < ApplicationRecord
  scope :active_state,  ->(user) { where(state: valid_states) }

  #....
  
  private

   def valid_states
       [1111, 9999]
   end

end
```
### Expected behavior

```ruby
User.active_state #=> [<User id: 10505747, ..>, ....]
```

```sql
SELECT "users".* 
FROM "users" 
WHERE ("users"."state" = $1 OR "users"."state" = $2)  [["state", 1111], ["state", 9999]]
```

### Actual behavior
```
NoMethodError - undefined method `valid_states' for #<User::ActiveRecord_Relation:0x00007f850b1bea58>:
```
### System configuration
**Rails version**:
5.2.0-rc2

**Ruby version**:
2.5.0
