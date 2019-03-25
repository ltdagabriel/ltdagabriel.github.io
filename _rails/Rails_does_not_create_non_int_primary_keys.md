---
title: Rails does not create non int primary keys
labels: activerecord, stale
layout: issue
---

related with: #10505

with the given migration:

``` ruby
class CreateBars < ActiveRecord::Migration
  def change
    create_table :bars, id: false, primary_key: :pk do |t|
      t.primary_key :pk, :string
    end

    create_table :foos, id: false, primary_key: :pk do |t|
      t.primary_key :pk
    end

    create_table :omgs, id: false, primary_key: :pk do |t|
      t.primary_key :pk, :int
    end
  end
end
```

will generates:

``` mysql
foo_rails$  desc bars;
+-------+--------------+------+-----+---------+-------+
| Field | Type         | Null | Key | Default | Extra |
+-------+--------------+------+-----+---------+-------+
| pk    | varchar(255) | YES  |     | NULL    |       |
+-------+--------------+------+-----+---------+-------+
1 row in set (0.00 sec)

foo_rails$  desc foos;
+-------+---------+------+-----+---------+----------------+
| Field | Type    | Null | Key | Default | Extra          |
+-------+---------+------+-----+---------+----------------+
| pk    | int(11) | NO   | PRI | NULL    | auto_increment |
+-------+---------+------+-----+---------+----------------+
1 row in set (0.00 sec)

foo_rails$  desc omgs;
+-------+---------+------+-----+---------+-------+
| Field | Type    | Null | Key | Default | Extra |
+-------+---------+------+-----+---------+-------+
| pk    | int(11) | YES  |     | NULL    |       |
+-------+---------+------+-----+---------+-------+
1 row in set (0.00 sec)
```

