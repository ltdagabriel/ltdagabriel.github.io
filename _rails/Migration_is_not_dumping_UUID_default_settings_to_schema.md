---
title: Migration is not dumping UUID default settings to schema
labels: activerecord, attached PR
layout: issue
---

I'm using Rails 4.0.0.rc1 and postgresql.  In a migration, I'm creating a table that sets UUID version 1 as the primary key, as follows:

``` ruby
create_table :users, id: false do |t|
  t.primary_key :id, :uuid, default: 'uuid_generate_v1()'
end
```

but when I rake db:migrate, the schema.rb shows

``` ruby
create_table "users", id: false, force: true do |t|
    t.uuid     "id",         null: false
end
```

With no default option.  Everything works fine until I have to do rake db:schema:load, which won't load the default and then PG will throw errors at me whenever I try to save anything into the database.  I find I have to rollback and re-migrate to get it to work, which is very annoying.

Anyone else getting this behavior?

