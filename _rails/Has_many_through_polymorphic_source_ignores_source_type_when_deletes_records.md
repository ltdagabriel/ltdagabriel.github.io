---
title: Has many through polymorphic source ignores source_type when deletes records
labels: activerecord
layout: issue
---

I have the next STI:

``` ruby
class ListItem < ActiveRecord::Base; end
class Feeling < ListItem; end
```

The :through association:

``` ruby
class ListItemRelationship < ActiveRecord::Base
  belongs_to :list_item, :polymorphic => true
  belongs_to :listable, :polymorphic => true
end
```

And the next model where I need to add a `has_many` association:

``` ruby
class StressTest < ActiveRecord::Base
  has_many :list_item_relationships, :as => :listable
  has_many :feelings, :through => :list_item_relationships, :source => :list_item, :source_type => "Feeling"
end
```

The issue with insertions was fixed in #23209 
But deletion still doesn't work properly, both these examples do fail:

``` ruby
test.feelings = []
test.feeling_ids = []
```

Rails 4-2-stable
To reproduce: https://gist.github.com/heaven/55416bc2d2d51dfdb511

