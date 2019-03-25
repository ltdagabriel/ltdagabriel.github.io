---
title: Foreign key to different table in migration does not reverse correctly
labels: activerecord
layout: issue
---

### Steps to reproduce

A new feature was introduced in response to #21563 which allows a different table to be specified in a `references` migration where the foreign key column does not match the table it is referencing.

For example, given two tables, "buildings" and "devices", where devices have a location association which is a building.

The AR class might be:

``` ruby
class Device < ApplicationRecord
  belongs_to :location, class_name: 'Building'
end
```

The location_id column can be added with a foreign key constraint using this new feature:

``` ruby
change_table(:devices) do |t|
  t.references :location, foreign_key: {to_table: :buildings}
end
```

This works as expected. In my schema I have:

``` ruby
add_foreign_key "devices", "buildings", column: "location_id"
```

However when I try to roll back this migration, it fails.
### Expected behaviour

Rolling back should remove the `location_id` column from `devices` and the foreign key constraint.
### Actual behaviour

The migration fails with the error:

```
== 20160527152008 AssociateDeviceWithBuilding: reverting ==============
-- remove_reference(:devices, :location, {:foreign_key=>{:to_table=>:buildings}})
rake aborted!
StandardError: An error has occurred, this and all later migrations canceled:

Table 'devices' has no foreign key for locations
-e:1:in `<main>'
ArgumentError: Table 'client_devices' has no foreign key for locations
```

What the reverse migration should be doing is looking for a foreign key for `buildings` but it seems to be ignoring the `to_table` parameter on reverse.
### System configuration

**Rails version**:
Rails 5 RC1

**Ruby version**:
ruby 2.2.3p173

