---
title: Possible bug in active record select_all
labels: activerecord
layout: issue
---

I have a Company that has_many Products.  I constructed a query in several steps by doing

```
c = Company.find(id)
p = c.products.order(:id).limit(500)
p = p.where(...)
```

I then do the following to get an array of hashes

```
query = p.select([:id, :code])
data = ActiveRecord::Base.connection.select_all(query)
```

This used to work in Rails 3.  We have upgraded to Rails 4 and when the code is run we get 

```
undefined method `reverse' for nil:NilClass
```

This is raised from the `to_sql` method in `/lib/active_record/connection_adapters/abstract/database_statements.rb` file and happens because the binds parameter is an empty array so `binds.shift.reverse` fails on line 14.

I can fix the problem in two ways.  

1) Pass the binding explicitly

```
data = ActiveRecord::Base.connection.select_all(query, nil, [[:company_id, 99]])
```

2) Construct the query without referencing the relation

```
p = Product.where(company_id: 99).order(:id).limit(500)
p = p.where(...)
```

I guess this isn't really `select_all` or `to_sql`'s fault, there is a that has gone binding missing from the `c.products` relationship. 

