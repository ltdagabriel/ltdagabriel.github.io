---
title: Ordering issue with has_many and "nulls last"
labels: activerecord, attached PR
layout: issue
---

Using Rails 4 and Postgres.  Invalid sql is generated with a custom has_many order clause when accessing `.last`

```
#models/profile.rb
class Profile < ActiveRecord::Base
  has_many :offers, -> { where(:deleted_at=>nil).order('featured ASC nulls last, id DESC') }
end

# models/offer.rb
class Offer < ActiveRecord::Base
  belongs_to :profile
end

## rails c

# works
>> AuthorProfile.first.offers.first 

# SQL error
>> AuthorProfile.first.offers.last

ActiveRecord::StatementInvalid: PG::Error: ERROR:  syntax error at or near "DESC"
LINE 1: ...ted_at" IS NULL  ORDER BY featured ASC nulls last DESC, id A...
                                                             ^
: SELECT  "offers".* FROM "offers"  WHERE "offers"."profile_id" = $1 AND "offers"."deleted_at" IS NULL  ORDER BY featured ASC nulls last DESC, id ASC LIMIT 1
```

