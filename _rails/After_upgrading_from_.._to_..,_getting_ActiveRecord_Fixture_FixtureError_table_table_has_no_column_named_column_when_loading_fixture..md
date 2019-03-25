---
title: After upgrading from 4.2.4 to 4.2.5, getting "ActiveRecord::Fixture::FixtureError table "table" has no column named "column" when loading fixture.
labels: activerecord, needs feedback
layout: issue
---

We're trying to upgrade from 4.2.4 and we're getting the error mentioned above when loading one of our fixture files.

I think I've narrowed it down to this commit in ActiveRecord: https://github.com/rails/rails/commit/e50fe85180648be0c4216bd0111f05be1df0988a

Which solves issue #21201

For some reason, for this particular column, this code fails:

```
if column = columns[name]
  key_list << quote_column_name(name) 
  quote(value, column)
else
  raise Fixture::FixtureError, %(table "#{table_name}" has no column named "#{name}".)
end
```

because `name` is a symbol, and `columns` is keyed by strings. 

I'm not sure why this happens for this fixture and not the others, presumably this failure here is indicative of a bug somewhere else, but this is as far as I've been able to drill down.

---

The exact error i'm getting is:

`ActiveRecord::Fixture::FixtureError: table "space_categories_spaces" has no column named "space_category_id".`

I believe this particular fixture is failing because it has a HABTM relationship:
### Models

```
class Space::Category < ActiveRecord::Base
end

class Space < ActiveRecord::Base
  has_and_belongs_to_many :categories, class_name: 'Space::Category', association_foreign_key: :space_category_id
end
```
### categories.yml

```
DEFAULTS: &DEFAULTS
  created_at: <%= Time.now %>
retail:
  <<: *DEFAULTS
  slug: retail

event:
  <<: *DEFAULTS
  slug: event
```
### spaces.yml

```
a_shop: &default
  slug: a_shop
  name: Shop Name
  categories: event,retail
```

If I remove this line: `categories: event,retail` from the fixture, it loads fine. Also, this fixture works well in 4.2.4.

Any help would be greatly appreciated!

