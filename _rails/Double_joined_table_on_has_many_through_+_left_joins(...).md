---
title: Double joined table on has many through + left_joins(...)
labels: activerecord
layout: issue
---

### Steps to reproduce

When joining a relationship with a has many through relation and using `.left_joins`, it is possible to join the same table with `INNER JOIN` and `LEFT OUTER JOIN` which crashes the query to the database.

I have a couple of models like this:

```ruby
class Account < ApplicationRecord
  belongs_to :stripe_customer
  has_many :stripe_cards, through: :stripe_customer
end
```

```ruby
class StripeCustomer < ApplicationRecord
  has_one :account
  has_many :stripe_cards
end
```

```ruby
class StripeCard < ApplicationRecord
  belongs_to :stripe_customer
end
```

I start by getting any instance of an account:
```ruby
account = Account.first
```

Then I try getting the StripeCard's for that account, which looks as expected:
```ruby
account.stripe_cards.to_sql #=> "SELECT "stripe_cards".* FROM "stripe_cards" INNER JOIN "stripe_customers" ON "stripe_cards"."stripe_customer_id" = "stripe_customers"."id" WHERE "stripe_customers"."id" = '1'"
```

I now try to join the StripeCustomer for those StripeCard's, which produces a double `INNER JOIN`, but the database is actually able handle this:
```ruby
account.stripe_cards.joins(:stripe_customer).to_sql #=> "SELECT "stripe_cards".* FROM "stripe_cards" INNER JOIN "stripe_customers" "stripe_customers_stripe_cards" ON "stripe_customers_stripe_cards"."id" = "stripe_cards"."stripe_customer_id" INNER JOIN "stripe_customers" ON "stripe_cards"."stripe_customer_id" = "stripe_customers"."id" WHERE "stripe_customers"."id" = '1'"
```

I now try to left join the StripeCustomer for those StripeCard's, which produces both an `INNER JOIN` and a `LEFT OUTER JOIN`, which crashes Postgres:
```ruby
account.stripe_cards.left_joins(:stripe_customer).to_sql #=> "SELECT "stripe_cards".* FROM "stripe_cards" INNER JOIN "stripe_customers" ON "stripe_cards"."stripe_customer_id" = "stripe_customers"."id" LEFT OUTER JOIN "stripe_customers" ON "stripe_customers"."id" = "stripe_cards"."stripe_customer_id" WHERE "stripe_customers"."id" = '1'"
```

This is the error I am getting: 
```ruby
[9] pry(#<CanCan::ControllerResource>)> puts account.stripe_cards.left_joins(:stripe_customer).to_a
ActiveRecord::StatementInvalid: PG::DuplicateAlias: ERROR:  table name "stripe_customers" specified more than once
: SELECT "stripe_cards".* FROM "stripe_cards" INNER JOIN "stripe_customers" ON "stripe_cards"."stripe_customer_id" = "stripe_customers"."id" LEFT OUTER JOIN "stripe_customers" ON "stripe_customers"."id" = "stripe_cards"."stripe_customer_id" WHERE "stripe_customers"."id" = $1
```

The problem occurs when using various frameworks to generate queries, and those frameworks are unaware of where the query actually comes from, and what has been called before, they can try to join like this, which crashes my app.

This happened to me, when I used CanCan's `load_resource` + some filters.

### Expected behavior
I would expect the join tracker to just keep the `INNER JOIN` and leave the `LEFT OUTER JOIN` out.

### Actual behavior
It produces both an `INNER JOIN` and a `LEFT OUTER JOIN` which crashes the query.

### System configuration
**Rails version**: 5.2

**Ruby version**: 2.4.4

