---
title: Rake db:fixtures:load - can't set fixture_class_name.
labels: activerecord, pinned
layout: issue
---

I have a many to many relation using a through table:

``` ruby
class User < ActiveRecord::Base
  has_many :badges, :through => :users_badges 
end

class UsersBadges < ActiveRecord::Base
  belongs_to :user
  belongs_to :badge
  belongs_to :badgesource, :polymorphic => true
end

class Badge < ActiveRecord::Base
  attr_accessible :points, :description
  has_many :users, :through => :users_badges
end
```

And a fixtures file named `users_badges.yaml` inside of test/fixtures.

The first issue was really that it was recognizing the class name for my UsersBadges model as UsersBadge ( which I'm not sure is correct - I couldn't find documentation on this).

So - the workaround was to add `set_fixture_class` before the fixtures are loaded inside of test_helper.rb

Unfortunately, this only works in the test context. It's nice to interact with the fixtures in the console but running rake:db:fixtures:load does the same naming conversion translation. 

When it gets the class name wrong, it doesn't correctly grok the fixture file. My fixtures are related using labels. The SQL insert statement isn't adjusted to use ids and I get:

table `users_badges` has no column named user: 

``` sql
INSERT INTO "users_badges" ("user", "badge", "badgesource") VALUES ('user1', 'mood_badge', 'rocking_out (Generic)').
```

The relevant code is around `lib/active_record/fixtures.rb:492`

