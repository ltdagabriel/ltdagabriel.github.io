---
title: Rename column with long name and index result in postgres error
labels: PostgreSQL, activerecord
layout: issue
---

In Rails 4, an error is raise when we rename a column with an index to a too long name.

Error stack : 

```
Input string is longer than NAMEDATALEN-1 (63)/home/bob/.rbenv/versions/1.9.3-p429/lib/ruby/gems/1.9.1/gems/activerecord-4.0.0/lib/active_record/connection_adapters/postgresql/quoting.rb:152:in `quote_ident'
/home/bob/.rbenv/versions/1.9.3-p429/lib/ruby/gems/1.9.1/gems/activerecord-4.0.0/lib/active_record/connection_adapters/postgresql/quoting.rb:152:in `quote_column_name'
/home/bob/.rbenv/versions/1.9.3-p429/lib/ruby/gems/1.9.1/gems/activerecord-4.0.0/lib/active_record/connection_adapters/postgresql/quoting.rb:139:in `quote_table_name'
/home/bob/.rbenv/versions/1.9.3-p429/lib/ruby/gems/1.9.1/gems/activerecord-4.0.0/lib/active_record/connection_adapters/postgresql/schema_statements.rb:424:in `rename_index'
/home/bob/.rbenv/versions/1.9.3-p429/lib/ruby/gems/1.9.1/gems/activerecord-4.0.0/lib/active_record/connection_adapters/abstract/schema_statements.rb:854:in `block in rename_column_indexes'
/home/bob/.rbenv/versions/1.9.3-p429/lib/ruby/gems/1.9.1/gems/activerecord-4.0.0/lib/active_record/connection_adapters/abstract/schema_statements.rb:848:in `each'
/home/bob/.rbenv/versions/1.9.3-p429/lib/ruby/gems/1.9.1/gems/activerecord-4.0.0/lib/active_record/connection_adapters/abstract/schema_statements.rb:848:in `rename_column_indexes'
/home/bob/.rbenv/versions/1.9.3-p429/lib/ruby/gems/1.9.1/gems/activerecord-4.0.0/lib/active_record/connection_adapters/postgresql/schema_statements.rb:411:in `rename_column'
/home/bob/.rbenv/versions/1.9.3-p429/lib/ruby/gems/1.9.1/gems/activerecord-4.0.0/lib/active_record/migration.rb:625:in `block in method_missing'
/home/bob/.rbenv/versions/1.9.3-p429/lib/ruby/gems/1.9.1/gems/activerecord-4.0.0/lib/active_record/migration.rb:597:in `block in say_with_time'
/home/bob/.rbenv/versions/1.9.3-p429/lib/ruby/1.9.1/benchmark.rb:280:in `measure'
/home/bob/.rbenv/versions/1.9.3-p429/lib/ruby/gems/1.9.1/gems/activerecord-4.0.0/lib/active_record/migration.rb:597:in `say_with_time'
/home/bob/.rbenv/versions/1.9.3-p429/lib/ruby/gems/1.9.1/gems/activerecord-4.0.0/lib/active_record/migration.rb:617:in `method_missing'
/home/bob/doc/dev/test-apps/testing4/db/migrate/20131018132332_rename_table.rb:3:in `change'
```

An app with the failure could be found [here](https://github.com/bobbus/testing-rails4/tree/bug-postgres-long-name), relevant commit is : bobbus/testing-rails4@4296e5db0e7581023412d2c1313c7738b5a533a0

