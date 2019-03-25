---
title: reset_counters() breaks with multiple belongs_to having same foreign keys
labels: activerecord
layout: issue
---

Given this code:

``` ruby
class Friendship < ActiveRecord::Base
  belongs_to :friend, class_name: 'User'
  belongs_to :follower, foreign_key: 'friend_id', class_name: 'User', counter_cache: :followers_count
end
```

``` ruby
class User < ActiveRecord::Base
  has_many :followers, foreign_key: 'friend_id', class_name: 'Friendship'
end
```

User.reset_counters(id, :follower) crashes

