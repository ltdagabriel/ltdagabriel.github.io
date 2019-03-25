---
title: Has many through polymorphic source inserts from source_type
labels: With reproduction steps, activerecord
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

The key think here is :source_type, which allows this to work. When I do:

``` ruby
test = StressTest.create
test.feelings << Feeling.first
```

Makes the following wrong insertion (even though the source_type specifies "Feeling", it inserts "ListItem"):

``` sql
INSERT INTO "list_item_relationships" ("listable_type", "list_item_type", "listable_id", "list_item_id", "created_at", "updated_at") VALUES ($1, $2, $3, $4, $5, $6) RETURNING "id"  [["listable_type", "StressTest"], ["list_item_type", "ListItem"], ["listable_id", 3], ["list_item_id", 8], ["created_at", "2016-01-23 11:58:34.079597"], ["updated_at", "2016-01-23 11:58:34.079597"]]
```

So then:

``` ruby
test.feelings.size
# => 1
test.feelings.count
# => 0
test.list_item_relationships.count
# => 1
```

When I call `#count` it looks for records with `list_item_type: Feeling`, when I add records to the association it inserts `list_item_type: ListItem`.

Same happens when I do `test.feeling_ids = [1, 2, 3, ...]`, it always inserts `list_item_type` of parent class of my STI.

Rails 4.2.5

