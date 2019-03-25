---
title: Custom :id data type and maintaining in schema.rb dump
labels: activerecord
layout: issue
---

We have done the following to create a table with an :id column and change its data type to be :bigint.

``` ruby
class CreatePersonNames < ActiveRecord::Migration
  def change
    create_table :person_names do |t|
      t.string :first
      t.string :last
      t.timestamps
    end
    change_column(:person_names, :id, :bigint)
  end
end
```

After running this migration the schema.rb will contain the following:

``` ruby
  create_table "person_names" do |t|
    t.string   "first"
    t.string   "last"
    t.datetime "created_at"
    t.datetime "updated_at"
  end
```

Notice that the data type change for the :id column is not maintained.

Additionally, we have tried to use a custom :id column definition by doing the following:

``` ruby
class CreatePersonNames < ActiveRecord::Migration
  def change
    create_table :person_names, id: false, primary_key: :id do |t|
      t.integer :id, limit: 8, null: false
      t.string :first
      t.string :last
      t.timestamps
    end
  end
end
```

This results in the following in the schema.rb:

``` ruby
  create_table "person_names", id: false, force: true do |t|
    t.integer  "id",         limit: 8, null: false
    t.string   "first"
    t.string   "last"
    t.datetime "created_at"
    t.datetime "updated_at"
  end
```

Notice that the schema dump does not maintain the primary key, but does maintain the data type of the id column.

And the migration results in the following table in MySQL:

``` sql
CREATE TABLE `person_names` (
  `id` bigint(20) NOT NULL,
  `first` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
```

Notice that there does not exist a PRIMARY KEY definition.

So, to summarize, the issue is a lack of ability to define a custom id column (name or data type) and have that customization be maintained in the schema dump.

