---
title: Migration: remove_column breaks custom primary key (3.2.12)
labels: activerecord
layout: issue
---

If you have a table in schema.rb like this:

```
create_table "my_table", :primary_key => "my_table_id", :force => true do |t|
  t.integer  "col_one"
  t.string   "col_two",         :limit => 128, :null => false
end
```

And you run a migration like this:

```
class RemoveColTwoFromMyTable < ActiveRecord::Migration
  def up
    remove_column :my_table, "col_two"
  end
# ...
end
```

You end up with a table that looks like this:

```
create_table "my_table", :id => false, :force => true do |t|
  t.integer  "my_table_id"
  t.integer  "col_one"
end
```

See that the primary key is gone, and just becomes another normal column.

