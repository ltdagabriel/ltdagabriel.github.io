---
title: postgresql_adapter.rb:default_sequence_name is broken for non-public schemas
labels: PostgreSQL, activerecord
layout: issue
---

The current code:

```
  # Returns the sequence name for a table's primary key or some other specified key.
  def default_sequence_name(table_name, pk = nil) #:nodoc:
    serial_sequence(table_name, pk || 'id').split('.').last
  rescue ActiveRecord::StatementInvalid
    "#{table_name}_#{pk || 'id'}_seq"
  end
```

rails 4 is slightly different, but still has the ".split('.').last" -- which is the bug.

This code seems to want to remove the schema name from the return value of "serial_sequence" -- a typical result from serial_sequence" might look like "public.foos_id_seq"  and the ".split('.').last" would resolve to "foos_id_seq".

the code would then be used by something that fetched from that object -- which works for "public" (or anything that is in the schema_search path) but wil fails if you have a table/model for table "other.foos" (that is, something not in the schema_search path OR if there is a public.foos and a other.foos -- you'll aways fetch from "public.foos").

since there is no "next_sequence_value" function this code probably has never been exercised -- sequence_name doesn't seem to be used anywhere for postgres, by default -- so you'll need the following code to exercise the issue:
- enable prefetching of the primary key
- add a "next_sequence_value" which simply requests the nextval for the value returned by sequence_name
- and a patch to fix "default_sequence_name"
  
  ```
  module ActiveRecord::ConnectionAdapters
    class PostgreSQLAdapter < AbstractAdapter
      def prefetch_primary_key?(table_name = nil)
        return true
      end
  
      def next_sequence_value(sequence_name)
        return execute("select nextval('#{sequence_name}')").field_values("nextval").first.to_i
      end
  
      def default_sequence_name(table_name, pk = nil) #:nodoc:
        serial_sequence(table_name, pk || 'id')
      rescue ActiveRecord::StatementInvalid
        "#{table_name}_#{pk || 'id'}_seq"
      end
  
    end
  end
  ```

