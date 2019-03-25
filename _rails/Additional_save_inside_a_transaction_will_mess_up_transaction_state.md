---
title: Additional save inside a transaction will mess up transaction state
labels: activerecord, stale
layout: issue
---

The following code, will mess up transaction state on `user` instance:

``` ruby
user = User.new
User.transaction do
  user.save!
  user.save!
end

user.instance_variable_get(:@_start_transaction_state)
# => {:id=>1, :new_record=>true, :destroyed=>false, :level=>1, :frozen?=>false}
```

This will cause a next failed transaction that includes `user` to set `user.new_record?` to `true`, which breaks the next attempt to save `user` because AR will try to INSERT it, thus duplicating primary key in DB (resulting in something along the lines of "PG::Error: ERROR: duplicate key value violates unique constraint "users_pkey" DETAIL: Key (id)=(1) already exists.").

The problem is that value of `:new_record` has not been updated after the transaction was committed. This was fixed in 44d1804, but that commit wasn't backported to 3.2 branch.

Another question is if `@_start_transaction_state` should even persist on `user` after the transaction is completed.

/cc @jjb

