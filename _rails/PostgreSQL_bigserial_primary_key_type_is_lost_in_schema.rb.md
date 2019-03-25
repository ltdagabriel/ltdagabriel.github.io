---
title: PostgreSQL bigserial primary key type is lost in schema.rb
labels: activerecord
layout: issue
---

I'm confused with the #10410 fix as it doesn't seem to provide a complete end-to-end solution.

According to ActiveRecord v4.1.2 release notes, the primary key can again be defined as `bigserial` as follows:

``` ruby
class CreateTestTable < ActiveRecord::Migration
  def change
    create_table :test_tables, id: :bigserial do |t|
      t.uuid :uuid
      t.index :uuid, unique: true
    end
  end
end
```

After migration, the DB table is created normally and visible in pgAdmin:

``` sql
CREATE TABLE test_tables
(
  id bigserial NOT NULL,
  uuid uuid,
  CONSTRAINT test_tables_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE test_tables
  OWNER TO testappuser;

CREATE UNIQUE INDEX index_test_tables_on_uuid
  ON test_tables
  USING btree
  (uuid);
```

However, `schema.rb` **lacks to mention** the `bigserial` as primary key type:

``` ruby
  create_table "test_tables", force: true do |t|  # wat?
    t.uuid "uuid"
  end

  add_index "test_tables", ["uuid"], name: "index_test_tables_on_uuid", unique: true, using: :btree
```

Running `rake db:schema:load` on a new DB will create a `serial` primary key, since that's the default type.

Thoughts?

