---
title: Postgresql UUID primary key not defaulting to using uuid_generate_v4() in test environment...
labels: activerecord
layout: issue
---

I'm running Rails 4.0.0.rc1 and have a table that uses UUID as primary key:

``` ruby
class CreateWebLinks < ActiveRecord::Migration
  def change
    create_table :web_links, id: :uuid do |t|
      t.boolean     :active,      default: true
      t.string      :url,         null: false, default: "http://"
      t.string      :title,       null: false, default: ""
      t.string      :description
      t.timestamps
    end
  end
end
```

When running migrations, the development database sets the default value to use PG's uuid_generate_v4() function to create the ID within the database.

I have not been able to get the test database to perform similarly. The ID is created and is denoted as UUID. However, the default value of 'uuid_generate_v4()' is not set in the database.

I've tried blowing the test database away, rake test:prepare and rake db:migrate RAILS_ENV=test. Can't seem to get it working and tests are failing as a result.

