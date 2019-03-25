---
title: ActiveRecord::SchemaDumper does not correctly dump method based defaults
labels: activerecord
layout: issue
---

(Replicated using version 4.0.0)

Somewhat related to Issue #10451, but a different issue.

Consider the following migration:  

``` ruby
class CreatePosts < ActiveRecord::Migration
        def self.up
                enable_extension "uuid-ossp"
                create_table :posts, id: :uuid, default: 'uuid_generate_v4()' do |t|
                        t.timestamps
                end
        end
end

```

where the id column is specified as a UUID that default to a genreated UUID. 

This generates a table like so: 

```
CREATE TABLE posts (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
```

However, when extracting the database schema using `ActiveRecord::SchemaDumper`, the table is represented by: 

```
  create_table "posts", id: false, force: true do |t|
    t.uuid     "id",         null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end
```

which in turn creates a table 

```
CREATE TABLE posts (
    id uuid NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

```

with data definition loss. The id column default has been lost in the export, causing issues later when it's expected to exist and automatically populate fields, such as defaults tend to do on occasion.

Defining sequence based defaults for integers, and exporting this information, appears to work, but it seems that this method based default is being lost in translation. 

