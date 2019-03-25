---
title: Create non-existing schema's as listed in database.yml on db:create
labels: activerecord, attached PR
layout: issue
---

I found this ticket on Lighthouse from 2008 regarding the automatic creation of PostgreSQL schemas defined in database.yml when db:create is called:

https://rails.lighthouseapp.com/projects/8994/tickets/1605-create-schema-during-rake-dbcreate-from-schema_search_path-if-it-does-not-exist-for-postgresql

It got shot down for some small reason and I wondered if things had changed significantly enough that it could now be added in?

Here's my use case: I have a schema_search_path defined in my database.yml file. When I run rake db:reset or db:setup I end up with an error because it created the database (but not the schema) and then tries to load seeds.rb which calls:

```
SET search_path TO some_value
```

The error is:

```
PGError: ERROR:  invalid value for parameter "search_path": "some_value"
DETAIL:  schema "some_value" does not exist
```

It'd be nice to be able to dump and reload the whole database with seeds (db:reset) but this currently isn't possible automatically when using schemas.

I've never done up a patch for Rails so if someone wanted to tackle this instead that would be cool. Otherwise some pointers on whether to change the rake file or the database adapter to achieve this outcome would be appreciated. I'm currently of the opinion that it'd be better done in the rake file as it is specific to db creation there. Though perhaps there is more to consider in how the test databases are created?

