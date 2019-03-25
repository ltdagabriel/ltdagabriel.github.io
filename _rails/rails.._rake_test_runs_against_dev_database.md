---
title: rails-3.2.7 rake test runs against dev database
labels: third party issue
layout: issue
---

```
rails new example
cd example
rails g scaffold thing name:string
rake db:migrate
rake db:test:prepare
rake test # passes
rm db/development.*
rake test # fails
```

Failure output:

```
You have 1 pending migrations:
  20120727024035 CreateThings
Run `rake db:migrate` to update your database then try again.
```

