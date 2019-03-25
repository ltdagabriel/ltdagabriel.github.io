---
title: STI broken: Association named 'yyy' was not found on Xxx; perhaps you misspelled it?
labels: activerecord, attached PR, regression
layout: issue
---

## Environment
- **Only Rails3.2.14**
- Ruby1.9,3; 2.0.0
## How to reproduce

```
# Create rails app
rails new sti_bug
cd sti_bug

# Create models
rails g model user 
rails g model user_account user_id:integer
rails g model thing user_account_id:integer type:string

# Run migrations
rake db:migrate
```

``` ruby
class User < ActiveRecord::Base
  has_many :user_accounts
end

class UserAccount < ActiveRecord::Base
  belongs_to :user
  has_many :things
end

class Thing < ActiveRecord::Base
  belongs_to :user_account

  scope :of_first_user, lambda {
    joins(:user_account => :user).
    where('users.id' => 1)
  }
end

class ConcreteThing < Thing
end
```

In console:

```
Thing.of_first_user # => works fine

ConcreteThing.of_first_user # => raise exception
# ActiveRecord::ConfigurationError: Association named 'user' was not found on ConcreteThing; perhaps you misspelled it?
```

In rails 3.2.13 it works OK.

