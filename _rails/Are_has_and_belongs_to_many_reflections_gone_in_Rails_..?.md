---
title: Are has_and_belongs_to_many reflections gone in Rails 4.1.0?
labels: activerecord
layout: issue
---

I don't understand why this behavior changed so heavily and how to get the old results back. Some of my abstract code depends on the `reflections` method.

In 4.0.4 this code returned something you would expect:

```
User.reflections.each_pair { |a, x| puts [a, x.macro].join(' => ') }

games => has_many
posts => has_many
players => has_many
teams => has_and_belongs_to_many
roles => has_and_belongs_to_many
```

In 4.1.0 the same database and model returns this:

```
User.reflections.each_pair { |a, x| puts [a, x.macro].join(' => ') }

games => has_many
posts => has_many
players => has_many
users_teams => has_many
teams => has_many
users_roles => has_many
roles => has_many
```

User model:

```
class User < ActiveRecord::Base
  acts_as_authentic

  has_many :games
  has_many :posts
  has_many :players
  has_and_belongs_to_many :teams
  has_and_belongs_to_many :roles

end  
```

