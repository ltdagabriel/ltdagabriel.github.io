---
title: scopes defined in abstract_class model fails to compute the table_name
labels: activerecord
layout: issue
---

In AR 4.0 and master, having an "abstract_class" model that doesn't have a table, and it's child **without a "type" column"**;

``` ruby
class AbstractModel < ActiveRecord::Base
  self.abstract_class = true
  scope :foo, -> { where '1=1' }
end

class User < AbstractModel
end
```

a scope defined in the parent class fails to compute the table_name.

```
% rails r 'puts User.all.to_sql'
SELECT "users".* FROM "users"

% rails r 'puts User.foo.to_sql'
SELECT "".* FROM ""  WHERE (1=1)
```

I know that this is not an intended way of using `abstract_class` but this code is actually in our production code, and was working under past versions of ActiveRecord.

@jonleighton Could this be fixed?

