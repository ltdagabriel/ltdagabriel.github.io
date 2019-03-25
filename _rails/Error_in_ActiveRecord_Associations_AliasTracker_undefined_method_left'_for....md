---
title: Error in ActiveRecord::Associations::AliasTracker: undefined method `left' for...
labels: activerecord, needs feedback, stale
layout: issue
---

White working with a project called RocketTag (https://github.com/bradphelan/rocket_tag) I encountered a confusing error in `ActiveRecord::Associations::AliasTracker`:

```
NoMethodError: undefined method `left' for :count:Symbol
# /Users/me/.rbenv/versions/1.9.3-p327-perf/lib/ruby/gems/1.9.1/gems/activerecord-3.2.6/lib/active_record/associations/alias_tracker.rb:64:in `block in initial_count_for'
```

https://github.com/bradphelan/rocket_tag/issues/47
https://groups.google.com/forum/?fromgroups=#!topic/rubyonrails-core/7IyNreMKhQs

What it boils down to is that the following code triggers the `NoMethodError: undefined method`left' for...` error:

``` ruby
class Foo < ActiveRecord::Base
  has_many :bars
end

class Bar < ActiveRecord::Base
  belongs_to :foo
end

q1 = Foo.joins(:bars).select('bars.id').as('bars')
q2 = Foo.from(q1).includes(:bars)

q2.present?
```

```
NoMethodError - undefined method `left' for "bars.id":Arel::SqlLiteral:
  (gem) activerecord-3.2.10/lib/active_record/associations/alias_tracker.rb:64:in `block in initial_count_for'
  (gem) arel-3.0.2/lib/arel/visitors/depth_first.rb:12:in `call'
  (gem) arel-3.0.2/lib/arel/visitors/depth_first.rb:12:in `visit'
  (gem) arel-3.0.2/lib/arel/visitors/depth_first.rb:159:in `block in visit_Array'
  (gem) arel-3.0.2/lib/arel/visitors/depth_first.rb:159:in `each'
  (gem) arel-3.0.2/lib/arel/visitors/depth_first.rb:159:in `visit_Array'
  (gem) arel-3.0.2/lib/arel/visitors/visitor.rb:19:in `visit'
  (gem) arel-3.0.2/lib/arel/visitors/depth_first.rb:11:in `visit'
  (gem) arel-3.0.2/lib/arel/visitors/depth_first.rb:135:in `visit_Arel_Nodes_SelectCore'
  (gem) arel-3.0.2/lib/arel/visitors/visitor.rb:19:in `visit'
  (gem) arel-3.0.2/lib/arel/visitors/depth_first.rb:11:in `visit'
  (gem) arel-3.0.2/lib/arel/visitors/depth_first.rb:159:in `block in visit_Array'
  (gem) arel-3.0.2/lib/arel/visitors/depth_first.rb:159:in `each'
  (gem) arel-3.0.2/lib/arel/visitors/depth_first.rb:159:in `visit_Array'
  (gem) arel-3.0.2/lib/arel/visitors/visitor.rb:19:in `visit'
  (gem) arel-3.0.2/lib/arel/visitors/depth_first.rb:11:in `visit'
  (gem) arel-3.0.2/lib/arel/visitors/depth_first.rb:143:in `visit_Arel_Nodes_SelectStatement'
  (gem) arel-3.0.2/lib/arel/visitors/visitor.rb:19:in `visit'
  (gem) arel-3.0.2/lib/arel/visitors/depth_first.rb:11:in `visit'
  (gem) arel-3.0.2/lib/arel/visitors/depth_first.rb:16:in `unary'
  (gem) arel-3.0.2/lib/arel/visitors/visitor.rb:19:in `visit'
  (gem) arel-3.0.2/lib/arel/visitors/depth_first.rb:11:in `visit'
  (gem) arel-3.0.2/lib/arel/visitors/depth_first.rb:61:in `binary'
  (gem) arel-3.0.2/lib/arel/visitors/visitor.rb:19:in `visit'
  (gem) arel-3.0.2/lib/arel/visitors/depth_first.rb:11:in `visit'
  (gem) arel-3.0.2/lib/arel/visitors/visitor.rb:5:in `accept'
  (gem) arel-3.0.2/lib/arel/nodes/node.rb:42:in `each'
  (gem) activerecord-3.2.10/lib/active_record/associations/alias_tracker.rb:57:in `map'
  (gem) activerecord-3.2.10/lib/active_record/associations/alias_tracker.rb:57:in `initial_count_for'
  (gem) activerecord-3.2.10/lib/active_record/associations/alias_tracker.rb:12:in `block in initialize'
  (gem) activerecord-3.2.10/lib/active_record/associations/alias_tracker.rb:30:in `yield'
  (gem) activerecord-3.2.10/lib/active_record/associations/alias_tracker.rb:30:in `aliased_name_for'
  (gem) activerecord-3.2.10/lib/active_record/associations/join_dependency.rb:17:in `initialize'
  (gem) activerecord-3.2.10/lib/active_record/relation/finder_methods.rb:225:in `new'
  (gem) activerecord-3.2.10/lib/active_record/relation/finder_methods.rb:225:in `construct_relation_for_association_calculations'
  (gem) activerecord-3.2.10/lib/active_record/relation/calculations.rb:157:in `calculate'
  (gem) activerecord-3.2.10/lib/active_record/relation/calculations.rb:162:in `calculate'
  (gem) activerecord-3.2.10/lib/active_record/relation/calculations.rb:58:in `count'
  (gem) activerecord-3.2.10/lib/active_record/relation.rb:210:in `empty?'
  (gem) mail-2.4.4/lib/mail/core_extensions/object.rb:8:in `blank?'
  (gem) activesupport-3.2.10/lib/active_support/core_ext/object/blank.rb:21:in `present?'
```

Not sure how to proceed from here...

