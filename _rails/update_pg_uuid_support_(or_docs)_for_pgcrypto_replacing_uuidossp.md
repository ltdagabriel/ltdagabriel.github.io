---
title: update pg uuid support (or docs) for pgcrypto replacing uuid-ossp
labels: PostgreSQL, docs
layout: issue
---

When creating a table like this

```
enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')
create_table :posts, id: :uuid
```

this happens

```
PG::UndefinedFunction: ERROR: function uuid_generate_v4() does not exist
```

because it's trying to use code from uuid-ossp, which has a different API.

A work-around is to use 

```
enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')
create_table :posts, id: :uuid, default: 'gen_random_uuid()'
```

My versions: pg 9.4.2 (postgresql.app for mac). Rails 4.1.10

I think the docs at [1.8 UUID](http://edgeguides.rubyonrails.org/active_record_postgresql.html#uuid) need updating to be consistent with [2](http://edgeguides.rubyonrails.org/active_record_postgresql.html#uuid-primary-keys) which show how to provide a default value that works with pgcrypto.
@senny thinks there may be some code to change also.
#19868 @senny

