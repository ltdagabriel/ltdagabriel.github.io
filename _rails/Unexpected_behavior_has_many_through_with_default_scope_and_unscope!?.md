---
title: Unexpected behavior: has_many :through with  default_scope and unscope!?
labels: activerecord, attached PR
layout: issue
---

I'm using Rails 4.1.0rc2 !!
My guess is that this is an issue with 4.1 exclusively because the unscope() and except() options were added there? (see #10643)

I'm not quite sure if this is indeed a bug or it is expected behavior, however i think i can make clear that the following does not make sense:

``` ruby

class Account < ActiveRecord::Base
  cattr_accessor :current

  has_many :people, dependent: :destroy
end

class Person < ActiveRecord::Base
  belongs_to :account
  belongs_to :user

  default_scope { where(account_id: Account.current) if Account.current }
  scope :across_all_accounts, -> { unscope(where: :account_id) }
end

class User < ActiveRecord::Base
  has_many :identities, ->{ across_all_accounts }, class_name: 'Person'
  has_many :accounts, through: :identities
end

```

Now i get in the rails console with some sample data:

``` ruby
# Account.current.id = 1  in this example

current_user.identities.pluck(:account_id)
  User Load (1.1ms)  SELECT  "users".* FROM "users"   ORDER BY "users"."id" DESC LIMIT 1
   (0.5ms)  SELECT "people"."account_id" FROM "people"  WHERE "people"."user_id" = $1  [["user_id", 1]]
=> [3, 1]

current_user.accounts.pluck(:id)
  User Load (1.1ms)  SELECT  "users".* FROM "users"   ORDER BY "users"."id" DESC LIMIT 1
   (0.6ms)  SELECT "accounts"."id" FROM "accounts" INNER JOIN "people" ON "accounts"."id" = "people"."account_id" WHERE "people"."account_id" = 1 AND "people"."user_id" = $1  [["user_id", 1]]
=> [1]
```

Note that in the second example the default_scope is somehow added again.
Is this intended?? Seems strange that one can get to the records using the "identities" association, but the :through options prevents that again.

I could add -> { unscope(where: :account_id) } again on the :accounts association, but i thought this should already be dealt with using :through identities.

