---
title: eager loading a has_many through association ignores order of through association
labels: activerecord, attached PR
layout: issue
---

Consider the following models:

```
class Article < ActiveRecord::Base
  has_many :by_lines, -> { order(:position) }
  has_many :authors, through: :by_lines
end

class ByLine < ActiveRecord::Base
  belongs_to :author
  belongs_to :article
end

class Author < ActiveRecord::Base

end
```

When lazy loading the `Article#authors` association the authors are returned in the same order as the corresponding by lines. When eager loading the association via an `includes` the authors are not returned in the same order as the corresponding by lines. This worked in Rails 3.2 and 4.0 but is broken in 4.1 and master.

Full test case: https://gist.github.com/jturkel/12de74334c4d69216d5f

