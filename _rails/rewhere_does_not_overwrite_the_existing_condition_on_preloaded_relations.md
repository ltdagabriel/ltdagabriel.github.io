---
title: rewhere does not overwrite the existing condition on preloaded relations
labels: activerecord, attached PR
layout: issue
---

Seems related to #15357

### Steps to reproduce

```ruby
# db/schema.rb

ActiveRecord::Schema.define(version: 20170118083959) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "posts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "taggings", force: :cascade do |t|
    t.integer  "tag_id"
    t.string   "taggable_type"
    t.integer  "taggable_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.index ["tag_id"], name: "index_taggings_on_tag_id", using: :btree
    t.index ["taggable_type", "taggable_id"], name: "index_taggings_on_taggable_type_and_taggable_id", using: :btree
  end

  create_table "tags", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "taggings", "tags"
end
```

```ruby
# app/models/post.rb

class Post < ApplicationRecord

  has_many :taggings, -> { rewhere(taggable_type: 'OtherModel') },                     as: :taggable, dependent: :destroy
  has_many :tags,                                                  through: :taggings

end
```

```ruby
# app/models/tag.rb

class Tag < ApplicationRecord

  has_many :taggings, inverse_of: :tag, dependent: :destroy

end
```

```ruby
# app/models/tagging.rb

class Tagging < ApplicationRecord

  belongs_to :tag,                         inverse_of: :taggings
  belongs_to :taggable, polymorphic: true

end
```

### Expected behavior
```ruby
Post.preload(:tags).first
```

Generated SQL
```sql
SELECT "taggings".* FROM "taggings" WHERE "taggings"."taggable_type" = $1 AND "taggings"."taggable_id" = 1  [["taggable_type", "OtherModel"]]
```

### Actual behavior
```ruby
Post.preload(:tags).first
```

Generated SQL
```sql
SELECT "taggings".* FROM "taggings" WHERE "taggings"."taggable_type" = $1 AND "taggings"."taggable_type" = $2 AND "taggings"."taggable_id" = 1  [["taggable_type", "OtherModel"], ["taggable_type", "Post"]]
```

The condition stated in `rewhere` is appended instead of overwritten.

Note that it does work when used without `preload`ing.

```ruby
Post.first.tags
```

```sql
SELECT "tags".* FROM "tags" INNER JOIN "taggings" ON "tags"."id" = "taggings"."tag_id" WHERE "taggings"."taggable_id" = $1 AND "taggings"."taggable_type" = $2  [["taggable_id", 1], ["taggable_type", "OtherModel"]]
```

```ruby
Post.first.taggings
```

```sql
SELECT "taggings".* FROM "taggings" WHERE "taggings"."taggable_id" = $1 AND "taggings"."taggable_type" = $2  [["taggable_id", 1], ["taggable_type", "OtherModel"]]
```

### System configuration
**Rails version**: 5.0.1

**Ruby version**: 2.3.3

