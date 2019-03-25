---
title: has_many through with uniq and preloading ignores uniq when calling collection size
labels: activerecord
layout: issue
---

Rails 3.0.10  (haven't had a chance to test the latest version yet).

There is an issue when using has_many through with uniq option, and trying to preload that association and calling size on the preloaded association (to prevent another query by using count).

``` ruby
class Project
  has_many :managers, :through => :jobs, :source => :worker, :uniq => true
end
```

``` ruby
project = Project.create!
2.times do
  human = Human.create!
  project.managers << [human, human, human]
end
```

WORKING:

``` ruby
Project.first.managers.count => 2
Project.first.managers.size => 2
Project.includes(:managers).first.managers.count => 2
```

NOT WORKING:

``` ruby
Project.includes(:managers).first.managers.size => 6  # should be 2 like the others

# i've already specified uniq in the association call, but have to call uniq again
Project.includes(:managers).first.managers.uniq.size => 2
```

