---
title: Migration errors out with "undefined method `join' for string" when removing an index from a table which contains a PG "jsonb_path_ops" index
labels: activerecord, attached PR
layout: issue
---

### Steps to reproduce

In any table, create an index like the following.

```
class CreateIndices < ActiveRecord::Migration[5.0]
  def change
    add_index :table_name, 'column_name_1 jsonb_path_ops', using: :gin
    add_index :table_name, [:column_name_2, :column_name_3], unique: true
  end
end
```

This creates the indices properly and everything is fine.

Now, create another migration like the following.

```
class EditIndices < ActiveRecord::Migration[5.0]
  def change
    remove_index :table_name, [:column_name_2, :column_name_3]
  end
end
```
### Expected behavior

When you run the second migration, it should just work as intended.
### Actual behavior

When you run the second migration, it fails with the following error:

```
== 20160927123731 EditIndices: migrating ==================================
-- remove_index(:table_name, [:column_name_2, :column_name_3])
rails aborted!
StandardError: An error has occurred, this and all later migrations canceled:

undefined method `join' for "column_name_1 jsonb_path_ops":String
Did you mean?  JSON
/Users/username/.rvm/gems/ruby-2.3.1@rails_app/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/abstract/schema_statements.rb:1210:in `block in index_name_for_remove'
/Users/username/.rvm/gems/ruby-2.3.1@rails_app/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/abstract/schema_statements.rb:1215:in `block (2 levels) in index_name_for_remove'
/Users/username/.rvm/gems/ruby-2.3.1@rails_app/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/abstract/schema_statements.rb:1215:in `each'
/Users/username/.rvm/gems/ruby-2.3.1@rails_app/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/abstract/schema_statements.rb:1215:in `all?'
/Users/username/.rvm/gems/ruby-2.3.1@rails_app/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/abstract/schema_statements.rb:1215:in `block in index_name_for_remove'
/Users/username/.rvm/gems/ruby-2.3.1@rails_app/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/abstract/schema_statements.rb:1215:in `select'
/Users/username/.rvm/gems/ruby-2.3.1@rails_app/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/abstract/schema_statements.rb:1215:in `index_name_for_remove'
/Users/username/.rvm/gems/ruby-2.3.1@rails_app/gems/activerecord-5.0.0.1/lib/active_record/connection_adapters/postgresql/schema_statements.rb:563:in `remove_index'
/Users/username/.rvm/gems/ruby-2.3.1@rails_app/gems/activerecord-5.0.0.1/lib/active_record/migration.rb:845:in `block in method_missing'
/Users/username/.rvm/gems/ruby-2.3.1@rails_app/gems/activerecord-5.0.0.1/lib/active_record/migration.rb:814:in `block in say_with_time'
/Users/username/.rvm/gems/ruby-2.3.1@rails_app/gems/activerecord-5.0.0.1/lib/active_record/migration.rb:814:in `say_with_time'
/Users/username/.rvm/gems/ruby-2.3.1@rails_app/gems/activerecord-5.0.0.1/lib/active_record/migration.rb:834:in `method_missing'
/Users/username/Projects/rails_app/db/migrate/20160927123731_edit_indices.rb:3:in `change'

```
### Workaround

Changing the migration to provide the name of the index makes the migration run successfully.

```
class EditIndices < ActiveRecord::Migration[5.0]
  def change
    remove_index :table_name, name: 'index_table_name_on_column_name_2_and_column_name_3'
  end
end
```
### System configuration

**Rails version**: 5.0.0.1

**Ruby version**: 2.3.1

