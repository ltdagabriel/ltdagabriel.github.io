---
title: Unexpected behaviour of non-persisted has_many through associations
labels: activerecord, pinned
layout: issue
---

Consider a basic hm:t association

```
class Host < ActiveRecord::Base
  has_many :links
  has_many :pages, through: :links
end
```

(`Link` and `Page` are trivial).

If you add and remove an item from `links`, it still thinks the item is magically present... in the empty collection:

```
host = Host.new
page = Page.new
host.pages.include? page
 => false
host.pages << page
host.pages.delete page
host.pages.include? page
 => true 
host.pages
 => #<ActiveRecord::Associations::CollectionProxy []>
```

Tried this on both 3.2.12 and 4.0.0.beta1.

PS. If you save the records, it works as expected.

