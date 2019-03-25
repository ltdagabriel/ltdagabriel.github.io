---
title: Transaction not rolling back object state when using .save instead of .save!
labels: activerecord
layout: issue
---

``` ruby
class MyModel < AR
 after_create do
   raise ActiveRecord::StatementInvalid.new("Dead locked")
 end
end

@model = MyModel.new
MyModel.transaction do
  @model.save
end
@model.new_record? == false
```

Shouldn't @model.new_record? still be true.

If I use a save!, it does roll back properly because save! doesn't wrap another level of transaction.

The issue is related to this line, where it only rolls back if it is in outermost transaction.
https://github.com/rails/rails/blob/3-2-stable/activerecord/lib/active_record/transactions.rb#L328

Is this expected behaviour, if so, what are the reasons for not rolling back .save methods.

