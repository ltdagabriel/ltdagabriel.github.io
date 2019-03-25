---
title: scope in belongs_to is not respected when used in join context
labels: With reproduction steps, activerecord
layout: issue
---

In particular, I pass scope argument to `belongs_to` to reverse the effect of `default_scope` in the parent model.

Here, I'm seeing an inconsistent behavior - the scope is respected when it's called on the child instance, but not when it's called on the relation using `joins`.

Here's models:

``` ruby
class User
  default_scope { where(disabled_at: nil) }
  has_one :profile
end

class Profile
  belongs_to :user, -> { unscope(where: :disabled_at) }
end
```

Now, given User:1 has disabled_at set:

``` ruby
# Fetches the user correctly
Profile.find(1).user
 => #<User:0x007f830af64728 ...

# Fails to fetch the user!
Profile.joins(:user).merge(User.where(id: 1))
 => []

# default_scope is not removed
Profile.joins(:user).merge(User.where(id: 1)).to_sql
 => "SELECT `profiles`.* FROM `profiles` INNER JOIN `users` ON `users`.`id` = `profiles`.`id` AND `users`.`disabled_at` IS NULL WHERE `users`.`disabled_at` IS NULL AND `users`.`id` = 1"
```

I think this is fairly confusing, and believe that the scope should be respected with the join relation as well.

Thoughts?

