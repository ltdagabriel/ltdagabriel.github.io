---
title: Migration to remove a "references" writes "remove_foreign_key" after "remove_references"
labels: activerecord
layout: issue
---

I created a migration to remove a references/belongs_to column from a model:

``` bash
$ bin/rails g migration remove_title_from_copies title:belongs_to
```

The generated migration was:

``` ruby
class RemoveTitleFromCopies < ActiveRecord::Migration
  def change
    remove_reference :copies, :title, index: true
    remove_foreign_key :copies, :titles
  end
end
```

When run, this migration raises a `StatementInvalid` error:

```
ActiveRecord::StatementInvalid: Mysql2::Error: Cannot drop index 'index_copies_on_title_id': needed in a foreign key constraint: ALTER TABLE `copies` DROP `title_id`
```

The order is correct for adding a `references` column -- `add_reference` then `add_foreign_key`, but not for removing it. When I reversed the order of the two commands the migration worked, but rollback failed. Splitting the migration into separate `up` and `down` methods with opposite command orders works for both migration and rollback.

``` ruby
class RemoveTitleFromCopies < ActiveRecord::Migration
  def up
    remove_foreign_key :copies, :titles
    remove_reference :copies, :title, index: true
  end

  def down
    add_reference :copies, :title, index: true
    add_foreign_key :copies, :titles
  end
end
```

