---
title: Unexpected behavior of AR::Enum with inherited models
labels: activerecord, attached PR, enum
layout: issue
---

For example we have following models:

```
class Transaction < ActiveRecord::Base
  enum system: [:cash, :credit_card, :paypal]
end
class Admin::Transaction < Transaction
end
```

Then in Rails 4.1.4:

```
Loading development environment (Rails 4.1.4)
irb(main):001:0> Transaction.first.system
  Transaction Load (0.2ms)  SELECT  "transactions".* FROM "transactions"   ORDER BY "transactions"."id" ASC LIMIT 1
=> "paypal"
irb(main):002:0> Admin::Transaction.first.system
  Admin::Transaction Load (0.7ms)  SELECT  "transactions".* FROM "transactions"   ORDER BY "transactions"."id" ASC LIMIT 1
=> 2
```

In Rails 4.1.0:

```
Loading development environment (Rails 4.1.0)
irb(main):001:0> t = Admin::Transaction.last
  Admin::Transaction Load (20.4ms)  SELECT  `transactions`.* FROM `transactions`   ORDER BY `transactions`.`id` DESC LIMIT 1
=> #<Admin::Transaction id: 2, system: 2, amount: #<BigDecimal:7fbf64732e38,'0.12E3',9(18)>, created_at: "2014-07-25 09:56:23", updated_at: "2014-07-25 10:01:08">
irb(main):002:0> t.system
=> "paypal"
irb(main):003:0> t.amount
=> #<BigDecimal:7fbf64732e38,'0.12E3',9(18)>
irb(main):004:0> t.system
=> 2
irb(main):005:0> t.system_before_type_cast
=> "paypal"
```

Method `system` later on returns fixnums after calling some other method, but previously it was a string. There was a bug? Still in Rails 4.1.4 enum works not as expected with namespaced models. In addition _before_type_cast in both cases always returns string value. All this is very confusing.

