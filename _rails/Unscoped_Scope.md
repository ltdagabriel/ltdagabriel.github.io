---
title: Unscoped Scope
labels: activerecord
layout: issue
---

There doesn't seem to be a way to define a scope that ignores any existing scopes (such as `default_scope`), unless using a class method:

``` ruby
default_scope where(:is_active => true)
```

``` ruby
# works
def self.inactive
  unscoped { where(:is_active => false) }
end
```

``` ruby
# none of these work
scope :inactive, unscoped { where(:is_active => false) }
scope :inactive, with_exclusive_scope { where(:is_active => true) }
scope :inactive, unscoped.where(:is_active => false)
scope :inactive, lambda { unscoped { where(:is_active => false) } }
scope :inactive, unscoped { lambda { where(:is_active => false) } }
scope :inactive, lambda { unscoped.where(:is_active => false) }
unscoped do
  scope :inactive, where(:is_active => false)
end
```

