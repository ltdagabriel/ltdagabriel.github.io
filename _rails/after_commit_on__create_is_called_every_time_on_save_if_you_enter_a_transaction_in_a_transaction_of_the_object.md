---
title: after_commit on: :create is called every time on save if you enter a transaction in a transaction of the object
labels: activerecord, attached PR
layout: issue
---

If you have the following model: (extremely simplified example)

``` ruby
class Person < ActiveRecord::Base
  after_create :save

  def after_commit_create
    puts "after_commit_create"
  end
  after_commit :after_commit_create, on: :create
end
```

And do the following:

``` ruby
p = Person.new
p.save
p.save
p.save
```

You will get the following output:

```
after_commit_create
after_commit_create
after_commit_create
```

The problem is that `save` calls `with_transaction_returning_status` which calls `add_to_transaction` which calls `remember_transaction_record_state` which will add a level to `@_start_transaction_state`. However, `clear_transaction_record_state` will be called only once in the end, causing `@_start_transaction_state` to persist across transactions. This in turn causes `transaction_include_any_action?(:create)` to return true across transactions, causing the `after_commit on: :create` to be called every time.

