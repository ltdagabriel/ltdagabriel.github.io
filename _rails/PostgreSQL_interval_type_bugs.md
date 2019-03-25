---
title: PostgreSQL interval type bugs
labels: activerecord
layout: issue
---

The PostgreSQL type "interval" can actually happen to have a precision. (See http://www.postgresql.org/docs/9.1/static/datatype-datetime.html )Thus "interval(6)" is a type as legal as "interval".

However, the current ActiveRecord implementation maps "interval" to :string (which is correct, as there is no Ruby data type which better matches the postgresql interval data type without data loss), but it maps "interval(6)" to :integer.

There are actually 3 bugs.
1. The first bug is that ActiveRecord::ConnectionAdapters::PostgreSQLColumn#simplified_type does not understand "interval(6)", while it should.
2. The second bug is that [ActiveRecord::ConnectionAdapters::Column#simplified_type](https://github.com/rails/rails/blob/53ca22f2e11cd3050d75385bc31b6bb5055a2738/activerecord/lib/active_record/connection_adapters/column.rb#L269) simply searches for the word "int" anywhere in the field type string (instead of checking whether field_type=="int").
3. The third bug is that [ActiveRecord::ConnectionAdapters::Column#simplified_type](https://github.com/rails/rails/blob/53ca22f2e11cd3050d75385bc31b6bb5055a2738/activerecord/lib/active_record/connection_adapters/column.rb#L269) does not raise an Exception if an unknown  field_type string is encountered, while it should, because developers and users would then clearly see where the limits of what the current implementation supports are crossed.

**Update**: changed title to not mess up with Github, old title was:

``` ruby
ActiveRecord::ConnectionAdapters::PostgreSQLColumn.new(nil,nil).send(:simplified_type,"interval(6)").should == ActiveRecord::ConnectionAdapters::PostgreSQLColumn.new(nil,nil).send(:simplified_type,"interval")
```

