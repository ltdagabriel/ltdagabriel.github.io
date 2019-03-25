---
title: add_column for postgres table with {array: true} option does not create array column in 4.0.0.rc1
labels: activerecord
layout: issue
---

I have the following migration to add a postgres array column to an existing table:

``` ruby
class AddIntArrayToGremlins < ActiveRecord::Migration
  def change
    add_column :gremlins, :int_array, :integer, array: true
  end
end
```

`rake db:migrate` succeeds, but the resulting table does not contain the array type.

`\d gremlins;` in `psql` shows:

```
  Column   |  Type   |                       Modifiers
-----------+---------+-------------------------------------------------------
 id        | integer | not null default nextval('gremlins_id_seq'::regclass)
 int_array | integer |
```

The dumped `db/schema.rb` shows:

``` ruby
create_table "gremlins", force: true do |t|
  t.integer "int_array"
end
```

I believe it worked in 4.0.0.beta1, as I recognized the regression just after upgrading to rc1.

