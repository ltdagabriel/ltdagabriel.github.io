---
title: after_commit hook does not fire from nested transaction
labels: activerecord
layout: issue
---

Upgrading from rails 3.2, after_commit no longer works when in nested transactions. The following works on 3.2.19 and fails on 4.0.8 and 4.1.4.

```
class Post < ActiveRecord::Base
  after_commit :do_something
  def do_something
    logger.warn "*** IN COMMIT ***"
  end
end

ActiveRecord::Base.transaction do
  ActiveRecord::Base.transaction(requires_new: true) do
    Post.create
  end
end
```

