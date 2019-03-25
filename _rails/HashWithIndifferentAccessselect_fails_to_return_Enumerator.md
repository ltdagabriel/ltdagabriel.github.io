---
title: HashWithIndifferentAccess#select fails to return Enumerator
labels: attached PR
layout: issue
---

Commit 20c065594f1434c93e6fe64cad062a0df1f42a8e corrects the behavior of `HashWithIndifferentAccess#select` to be consistent with that of `Hash#select`, in that it returns the hash itself when unchanged. 

However, that fix introduced a different inconsistency with `Hash#select`, whereby HWIA's version will no longer return an `Enumerator` when no block is given. Thus `select` can no longer be added to with other Enumerator methods such as `with_index` and `with_object` and breaks expectations for anyone treating HWIA instances as full implementations of Enumerable.

A proposed solution follows after this demonstration of the issue.

**Example behavior for standard Hash**

``` ruby
some_hash = { a: 1, b: 2, c: 3 }

# Hash#select behavior with block:
some_hash.select { |k, v| true }
# => {:a=>1, :b=>2, :c=>3}

# Hash#select behavior without block:
some_hash.select
#<Enumerator: {:a=>1, :b=>2, :c=>3}:select> 
some_hash.select.with_index
=> #<Enumerator: #<Enumerator: {:a=>1, :b=>2, :c=>3}:select>:with_index> 
```

**HWIA behavior before 20c065594f1434c93e6fe64cad062a0df1f42a8e**

``` ruby
some_hwia = HashWithIndifferentAccess.new({ a: 1, b: 2, c: 3 })

# HWIA#select with block is inconsistent:
some_hwia.select { |k, v| true }
# => nil

# HWIA#select without block is consistent:
some_hwia.select
=> #<Enumerator: {:a=>1, :b=>2, :c=>3}:select>
some_hwia.select.with_index
=> #<Enumerator: #<Enumerator: {:a=>1, :b=>2, :c=>3}:select>:with_index>
```

**HWIA behavior after 20c065594f1434c93e6fe64cad062a0df1f42a8e**

``` ruby
some_hwia = HashWithIndifferentAccess.new({ a: 1, b: 2, c: 3 })

# HWIA#select with block is now consistent:
some_hwia.select { |k, v| true }
# => {"a"=>1, "b"=>2, "c"=>3}

# HWIA#select without block is now inconsistent:
some_hwia.select
# => {"a"=>1, "b"=>2, "c"=>3}
some_hwia.select.with_index
# NoMethodError: undefined method `with_index' for {"a"=>1, "b"=>2, "c"=>3}:ActiveSupport::HashWithIndifferentAccess
```

The issue can be resolved, and both cases made consistent, if `HWIA#select` is implemented thusly:

``` ruby
def select(*args, &block)
  copy = dup
  copy.select!(*args, &block) || copy
end
```

I do not immediately have a forked copy of Rails set up with which to provide tests and a pull request, but will endeavor to do so in the coming week. 

Please let me know if there is anything I can do to improve the description of this issue.

