---
title: Double save with record.association.create! in Rails 3.1.0.rc1
labels: activerecord, regression
layout: issue
---

Here's a fun one I found this morning. Took about 4 hours to pinpoint this sucker.
This problem exists in both rc1 and the master branch.

```
class Foo < ActiveRecord::Base
  has_many :bars
end

class Bar < ActiveRecord::Base
  belongs_to :foo

  before_save :hi
  after_save :bye

  def hi
    p "HI #{self.id}"
  end

  def bye
    p "BYE #{self.id}"
  end
end
```

Here's little test to run:

```
class BarTest < ActiveSupport::TestCase
  def setup
    @foo = Foo.create!
  end

  def test_direct_create
    Bar.create!
  end

  def test_save
    bar = @foo.bars.new
    bar.save!
  end

  def test_create_via_association
    @foo.bars.create
  end

  def test_create_via_association_gone_bad
    @foo.bars.create!
  end
end
```

Few sanity checks, but the meat of the problem is at the last two. When you run the `test_create_via_association` this is the debug output:

```
"HI "
"BYE 980190963"
```

That's expected. Next test should have exactly the same output. But:

```
"HI "
"BYE 980190963"
"HI 980190963"
"BYE 980190963"
```

For some reason `create!` will trigger save twice, but only via association. Any thoughts how this is happening?

