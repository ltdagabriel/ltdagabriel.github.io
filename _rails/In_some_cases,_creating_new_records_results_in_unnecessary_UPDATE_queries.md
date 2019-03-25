---
title: In some cases, creating new records results in unnecessary UPDATE queries
labels: activerecord
layout: issue
---

Take the following example:

``` ruby
class List < ActiveRecord::Base
  has_many :categories, inverse_of: :list
  has_many :items, inverse_of: :list
  accepts_nested_attributes_for :categories
end

class Category < ActiveRecord::Base
  cattr_accessor :create_count, :update_count do 0 end
  after_create -> { @@create_count += 1 }
  after_update -> { @@update_count += 1 }

  belongs_to :list, inverse_of: :categories
  has_many :items, inverse_of: :category
end

class Item < ActiveRecord::Base
  belongs_to :list, inverse_of: :items
  belongs_to :category, inverse_of: :items
end
```

The following example passes in Rails 4.1.1, but fails in 4.1.2 and later (including `master`):

``` ruby
describe Item, type: :model do
  it 'does not perform an unnecessary UPDATE query' do
    list = List.new

    category = list.categories.build
    item = list.items.build category: category

    list.save!

    expect(Category.create_count).to eq 1
    expect(Category.update_count).to eq 0
  end
end
```

Note that in this example, although the undirected graph has a cycle, there are no cycles in the **directed** dependency graph, so it's possible to save the data to the database using only INSERTs.  In Rails 4.1.1, the queries are:

```
D, [2015-01-27T14:19:16.771733 #3083] DEBUG -- :   SQL (0.3ms)  INSERT INTO "lists" DEFAULT VALUES
D, [2015-01-27T14:19:16.773543 #3083] DEBUG -- :   SQL (0.1ms)  INSERT INTO "categories" ("list_id") VALUES (?)  [["list_id", 5]]
D, [2015-01-27T14:19:16.774171 #3083] DEBUG -- :   SQL (0.1ms)  INSERT INTO "items" ("category_id", "list_id") VALUES (?, ?)  [["category_id", 5], ["list_id", 5]]
```

In `master`:

```
D, [2015-01-27T14:22:34.739281 #3348] DEBUG -- :   SQL (0.3ms)  INSERT INTO "lists" DEFAULT VALUES
D, [2015-01-27T14:22:34.739963 #3348] DEBUG -- :   SQL (0.1ms)  INSERT INTO "categories" DEFAULT VALUES
D, [2015-01-27T14:22:34.755012 #3348] DEBUG -- :   SQL (0.1ms)  INSERT INTO "items" ("list_id", "category_id") VALUES (?, ?)  [["list_id", 6], ["category_id", 6]]
D, [2015-01-27T14:22:34.756489 #3348] DEBUG -- :   SQL (0.1ms)  UPDATE "categories" SET "list_id" = ? WHERE "categories"."id" = ?  [["list_id", 6], ["id", 6]]
```

This is related to (but probably doesn't fully address) https://github.com/swanandp/acts_as_list/issues/153.

