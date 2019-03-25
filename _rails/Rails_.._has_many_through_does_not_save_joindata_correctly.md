---
title: Rails 3.2.1 has_many :through does not save join-data correctly
labels: activerecord
layout: issue
---

if you use :conditions in a has_many :through relationship, it does not set the data in the join-model correctly.
e.g. a join-model "Authorships" which also stores a "role" attribute:

```
class Author < ActiveRecord::Base
  has_many :authorships
  has_many :books,    :through => :authorships
end

class Authorship < ActiveRecord::Base
  belongs_to :author
  belongs_to :book
end

class Book < ActiveRecord::Base
  has_many :authorships
  has_many :authors, :through => :authorships

  has_many :co_authors, :through => :authorships, :source => :author, :conditions => { 'authorships.role' => :co_author }
  has_many :main_authors, :through => :authorships, :source => :author, :conditions => { 'authorships.role' => :main_author }
end
```

This use of :conditions produces the correct SQL for looking up co_authors and main_authors, but does not produce the correct SQL to set the data in the join table.

```
b = Book.create(:name => "Programming Ruby")
dave = b.main_authors.create(:name => "David Thomas")

begin transaction
  INSERT INTO "authors" ("created_at", "name", "updated_at") VALUES (?, ?, ?)  [["created_at", Thu, 16 Feb 2012 09:46:04 UTC +00:00], ["name", "David Thomas"], ["updated_at", Thu, 16 Feb 2012 09:46:04 UTC +00:00]]
  INSERT INTO "authorships" ("author_id", "book_id", "created_at", "role", "updated_at") VALUES (?, ?, ?, ?, ?)  [["author_id", 1], ["book_id", 1], ["created_at", Thu, 16 Feb 2012 09:46:04 UTC +00:00], ["role", nil], ["updated_at", Thu, 16 Feb 2012 09:46:04 UTC +00:00]]
commit transaction  
```

The above transaction sets ["role", nil] , instead of ["role", 'main_author"]

_:conditions should set a scope for both the creation and look-up of entries -- e.g. scope the creation to set the role correctly._

The look-up however produces the correct SQL: (of course the data is never correctly saved in the join model in the first place)

```
b = Book.first
b.main_authors

SELECT "authors".* FROM "authors" INNER JOIN "authorships" ON "authors"."id" = "authorships"."author_id" WHERE "authorships"."book_id" = 1 AND ("authorships"."role" = 'main_author')
=> []    # empty because data was not saved correctly in the first place; but SQL for lookup is correct.
```

