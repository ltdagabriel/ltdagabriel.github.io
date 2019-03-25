---
title: PredicateBuilder does not properly parse attribute hash with depth more than 2
labels: activerecord, regression
layout: issue
---

In PredicateBuilder (3.2.12) the build_from_hash method has the following lines:

``` ruby
module ActiveRecord
  class PredicateBuilder # :nodoc:
    def self.build_from_hash(engine, attributes, default_table, allow_table_name = true)
      predicates = attributes.map do |column, value|
        table = default_table

        if allow_table_name && value.is_a?(Hash)
          table = Arel::Table.new(column, engine)

          if value.empty?
            '1 = 2'
          else
            build_from_hash(engine, value, table, false)
          end
        else
          column = column.to_s
          ...
```

If I pass

``` ruby
{:tasks=>{:jobs=>{:franchises=>{:id=>1}}}}
```

 as the attribute parameter then the code doesn't recurse all the way down.  The line

``` ruby
build_from_hash(engine, value, table, false)
```

stops the recursion at depth 2 in the hash.  I noticed this problem because I updated my Rails app from 3.2.2 to 3.2.12.  Removing the false parameter seems to fix my problem but I don't fully understand the impact of that change.

