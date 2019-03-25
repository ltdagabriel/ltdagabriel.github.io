---
title: Count on a association of an unsaved item should raise
labels: activerecord
layout: issue
---

Consider the following code

```
class Account
  has_many :dossiers
end

class Dossier
  belongs_to :account
end


a = Account.new
a.dossiers.build

a.dossiers.count
SELECT COUNT(*) FROM "dossiers" WHERE "dossiers"."account_id" IS NULL
=> 0

a.dossiers.size
=> 1

a.dossiers.length
=> 1
```

I'd suggest that doing a count on an association of an unsaved parent should raise something like "Parent not saved yet!". Otherwise the result seems surpring and can easily lead to errors. Especially when there are them dossiers in the database which have account_id set to nil.

