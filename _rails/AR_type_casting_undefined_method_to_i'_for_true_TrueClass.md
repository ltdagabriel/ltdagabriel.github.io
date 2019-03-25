---
title: AR type casting: undefined method `to_i' for true:TrueClass
labels: regression
layout: issue
---

This is a regression in 3-2-stable.  Code works fine in 3.2.6.

```
   undefined method `to_i' for true:TrueClass
 # /Users/mperham/src/rails/activerecord/lib/active_record/connection_adapters/column.rb:78:in `type_cast'
 # /Users/mperham/src/rails/activerecord/lib/active_record/attribute_methods/dirty.rb:86:in `_field_changed?'
 # /Users/mperham/src/rails/activerecord/lib/active_record/attribute_methods/dirty.rb:63:in `write_attribute'
 # /Users/mperham/src/rails/activerecord/lib/active_record/attribute_methods/write.rb:14:in `admin='
```

