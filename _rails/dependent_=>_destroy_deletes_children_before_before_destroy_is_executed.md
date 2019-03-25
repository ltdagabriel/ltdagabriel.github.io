---
title: dependent => :destroy deletes children before "before_destroy" is executed
labels: activerecord
layout: issue
---

_Reposting #670 since the lighthouse importer auto-closed it, even though it was still open on lighthouse..._

Problem: Upon destroying an ActiveRecord::Base object, the "before_destroy" method - which should trigger a transaction rollback if returning false - is only exceuted AFTER all child objects have been destroyed via ":dependent => :destroy".

However, this prevents `before_destroy` from seeing those same child objects, in case it needs them to determine whether the destruction should be successful.

Expected behaviour:

`before_destroy` should be called _before_ any objects are destroyed, even child records. The `before_destroy` context should see the original state of the application as if `destroy` were never called. It should be executed within the `destroy` transaction, however, so that any changes it makes can be rolled back.

```
class Foo < AR::Base
  has_many :children, :dependent => :destroy
  has_many :grandchildren, :through => :children

  before_destroy :check
  def check
    # will always be true since all grandchildren have already been destroyed at this stage
    return self.grandchildren.still_there.empty?
  end
end

class Child < AR::Base
  has_many :grandchildren
  belongs_to :foo
end

class Grandchild < AR::Base
  belongs_to :child
  scope :still_there, :conditions => ...
end
```

