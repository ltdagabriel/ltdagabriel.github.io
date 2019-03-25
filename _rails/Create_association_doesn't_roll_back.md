---
title: Create association doesn't roll back
labels: activerecord
layout: issue
---

Rails 5.0.2
Ruby 2.3.1

I'm not sure whether this is a feature or a bug. For the given models:

```ruby
class Foo < ApplicationRecord
  has_many :bars
end

class Bar < ApplicationRecord
  belongs_to :foo

  before_create do
    throw(:abort)
  end
end
```

And running:
```ruby
##
# These are expected and work as expected
foo = Foo.create
# => BEGIN
# => COMMIT

bar = Bar.create
# => BEGIN
# => ROLLBACK

##
# This is what I would expect
foo.bars.create
# => BEGIN
# => ROLLBACK

##
# This is what actually happens
foo.bars.create
# => BEGIN
# => COMMIT
```

So even though the class `Bar` throws `:abort`, Rollback is not called.
If this is a feature, and I rely on `after_rollback` to undo something crucial elsewhere; Then I shouldn't count the create association as reliable or rethink the way I'm undoing crucial code.

