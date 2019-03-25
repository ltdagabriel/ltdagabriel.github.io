---
title: Pull #6986 causes regression in version 3.2.9
labels: activerecord
layout: issue
---

Pull #6986 causes a backward-incompatible change in behavior in Rails version 3.2.9.

I have two issues with this pull request:
1. The code was introduced to fix a MySQL-specific behavior but it affects people who aren't using a `mysql` adapter.
2. It causes a regression in behavior from the previous patch version.

Here is an example test that passes in version 3.2.8 but fails in 3.2.9:

``` ruby
class Parent < ActiveRecord::Base
  has_one :child
end

class Child < ActiveRecord::Base
  belongs_to :parent, :touch => true
end

setup do
  @parent = Parent.create
  Child.create(:parent => @parent)
end

def test_cache_key_changes_when_child_touched
  key = @parent.cache_key
  @parent.child.touch
  @parent.reload
  assert_not_equal key, @parent.cache_key # F
end
```

In version 3.2.8, this test passed because it only required a fraction of a second to pass between when the parent was created an touched.

The only way I can make this test pass in version 3.2.9 (without monkey patching) is by adding `sleep 1` before `@object.child.touch`.

