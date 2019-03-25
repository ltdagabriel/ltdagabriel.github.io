---
title: Rails master: after_commit(on: :update) is executed erroneously when a model is saved in an after_create callback
labels: activerecord
layout: issue
---

If a model is being saved in an `after_create` callback, then its internal `@_start_transaction_state[:new_record]` value will be set to `false`, indicating that the model was updated, thus hiding the fact that it was created as well.

This implies the `after_commit(on: :create)` will not be executed and `after_commit(on: :update)`—erroneously—will be.

``` ruby
# user.rb
class User < ActiveRecord::Base
  after_create { self.save! }
  after_commit(on: :create) { puts "did run on create" }
  after_commit(on: :update) { puts "did run on update" }
end

# terminal
> User.create
   (0.1ms)  begin transaction
  SQL (4.9ms)  INSERT INTO "users" ("created_at", "updated_at") VALUES (?, ?)  [["created_at", Mon, 14 Jan 2013 17:46:24 UTC +00:00], ["updated_at", Mon, 14 Jan 2013 17:46:24 UTC +00:00]]
   (0.2ms)  UPDATE "users" SET "created_at" = '2013-01-14 17:46:24.710539', "updated_at" = '2013-01-14 17:46:24.710539' WHERE "users"."id" = 1
   (0.8ms)  commit transaction
did run on update
```

This change is breaking since 44d1804, which removed conditionals that prevented this kind of overlap.

The #8577 issue mentions another bug that is actually fixed with the commit 44d1804 (but can be fixed in a different way as well), so the fix is not to revert that commit, obviously.

/cc: @jjb

