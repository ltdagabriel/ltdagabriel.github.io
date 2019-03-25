---
title: Rails continuously checks the schema migrations table on every request
labels: activerecord
layout: issue
---

Here's what I'm seeing the server logs on `development` (webrick, edge rails 64e3660ff0c0fd708fd4fc5455c54bf3d511032b )

```
Started GET "/asdf/jkl" for 127.0.0.1 at 2013-01-09 00:13:52 +0530
  ActiveRecord::SchemaMigration Load (0.2ms)  SELECT "schema_migrations".* FROM "schema_migrations"
Processing by HomeController#read as HTML
  Parameters: {"path"=>"asdf/jkl"}
  Rendered home/read.html.erb within layouts/application (0.0ms)
Completed 200 OK in 10ms (Views: 10.2ms | ActiveRecord: 0.0ms)


Started GET "/assets/reader.css?body=1" for 127.0.0.1 at 2013-01-09 00:13:53 +0530


Started GET "/assets/custom_bootstrap.css?body=1" for 127.0.0.1 at 2013-01-09 00:13:53 +0530
  ActiveRecord::SchemaMigration Load (0.3ms)  SELECT "schema_migrations".* FROM "schema_migrations"
  ActiveRecord::SchemaMigration Load (0.2ms)  SELECT "schema_migrations".* FROM "schema_migrations"


Started GET "/assets/pages.css?body=1" for 127.0.0.1 at 2013-01-09 00:13:53 +0530
  ActiveRecord::SchemaMigration Load (0.2ms)  SELECT "schema_migrations".* FROM "schema_migrations"


Started GET "/assets/jquery.js?body=1" for 127.0.0.1 at 2013-01-09 00:13:53 +0530


  ActiveRecord::SchemaMigration Load (0.2ms)  SELECT "schema_migrations".* FROM "schema_migrations"
Started GET "/assets/admin.css?body=1" for 127.0.0.1 at 2013-01-09 00:13:53 +0530
  ActiveRecord::SchemaMigration Load (0.3ms)  SELECT "schema_migrations".* FROM "schema_migrations"


Started GET "/assets/home.css?body=1" for 127.0.0.1 at 2013-01-09 00:13:53 +0530
  ActiveRecord::SchemaMigration Load (0.2ms)  SELECT "schema_migrations".* FROM "schema_migrations"


Started GET "/assets/jquery_ujs.js?body=1" for 127.0.0.1 at 2013-01-09 00:13:53 +0530
  ActiveRecord::SchemaMigration Load (0.3ms)  SELECT "schema_migrations".* FROM "schema_migrations"
```

