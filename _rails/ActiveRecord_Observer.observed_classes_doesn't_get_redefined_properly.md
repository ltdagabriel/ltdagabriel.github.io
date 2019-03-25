---
title: ActiveRecord::Observer.observed_classes doesn't get redefined properly
labels: activerecord
layout: issue
---

This is an intentional duplicate of #1034, which was just closed without any solution.

```
class Foo < ActiveRecord::Base
end

class BarObserver < ActiveRecord::Observer
  observe :foo
end

ruby-1.8.7-p174 > BarObserver.observed_classes
NameError: uninitialized constant Bar
    from /Users/pivotal/.rvm/gems/ruby-1.8.7-p174/gems/activesupport-3.0.6/lib/active_support/inflector/methods.rb:113:in `constantize'
    from /Users/pivotal/.rvm/gems/ruby-1.8.7-p174/gems/activesupport-3.0.6/lib/active_support/inflector/methods.rb:112:in `each'
    from /Users/pivotal/.rvm/gems/ruby-1.8.7-p174/gems/activesupport-3.0.6/lib/active_support/inflector/methods.rb:112:in `constantize'
    from /Users/pivotal/.rvm/gems/ruby-1.8.7-p174/gems/activesupport-3.0.6/lib/active_support/core_ext/string/inflections.rb:43:in `constantize'
    from /Users/pivotal/.rvm/gems/ruby-1.8.7-p174/gems/activemodel-3.0.6/lib/active_model/observing.rb:182:in `observed_class'
    from /Users/pivotal/.rvm/gems/ruby-1.8.7-p174/gems/activemodel-3.0.6/lib/active_model/observing.rb:175:in `observed_classes'
    from (irb):1
```

By reading the implementation at https://github.com/rails/rails/blob/v3.0.6/activemodel/lib/active_model/observing.rb#L158-163 I would expect BarObserver's observed_classes method to have been redefined to return [Foo] without trying to find the non-existant Bar class.

