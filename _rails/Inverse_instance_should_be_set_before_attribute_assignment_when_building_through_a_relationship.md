---
title: Inverse instance should be set before attribute assignment when building through a relationship
labels: activerecord, stale
layout: issue
---

As the title says ^

Consider:

``` ruby
class Child < ActiveRecord::Base
  belongs_to :parent, inverse_of: :children

  def first_name= value
    super.tap { self.name = "#{value} #{parent.last_name}" }
  end
end
```

``` ruby
class Parent < ActiveRecord::Base
  has_many :children, inverse_of: :parent
end
```

Now when I run the code:

``` ruby
child = Parent.new(first_name: 'John', last_name: 'Smith').children.build(first_name: 'Alex')
```

I'd expect it to give the child the parent object before assigning the attributes. Something like....

``` ruby
child.name #= Alex Smith
```

But it doesn't. In method `first_name=` parent is still `nil` !!!

