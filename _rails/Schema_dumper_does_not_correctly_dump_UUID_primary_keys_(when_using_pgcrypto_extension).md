---
title: Schema dumper does not correctly dump UUID primary keys (when using pgcrypto extension)
labels: activerecord
layout: issue
---

In continue of #10451.

I'm now migrating to **PostgreSQL 9.4 beta 1** (OS X, installed from Homebrew) and want to use UUIDs as primary keys. But `uuid-ossp` extension isn't available in this beta! [Official documentation](http://www.postgresql.org/docs/9.4/static/uuid-ossp.html) discourages its usage, and there are [talks in mailing lists](http://www.postgresql.org/message-id/9285.1400387306@sss.pgh.pa.us) to throw it away or may be [replace implementation](http://www.postgresql.org/message-id/53843FF6.9030803@beccati.com).

So I've decided to switch to [pgcrypto](http://www.postgresql.org/docs/9.4/static/pgcrypto.html) extension, and use `gen_random_uuid()` method from it to generate identifiers.

But schema dumper dumps this (we're lost the primary key constraint on schema load):

``` ruby
create_table "pg_uuids", id: false, force: true do |t|
  t.uuid   "id",         default: "gen_random_uuid()", null: false
  t.string "name"
  t.uuid   "other_uuid", default: "gen_random_uuid()"
end
```

Instead of this:

``` ruby
create_table "pg_uuids", id: :uuid, default: "gen_random_uuid()", force: true do |t|
  t.string "name"
  t.uuid   "other_uuid", default: "gen_random_uuid()"
end
```

See self-contained gist to test that: https://gist.github.com/Envek/0580865d6fea8df7374b

This issue present in both master and 4.1-stable.
## Reason

`ActiveRecord::Base.connection.pk_and_sequence_for(table_name)` doesn't return primary key column name, when default value is the function other than `nextval` or `uuid_generate_*`, see  [`activerecord/lib/active_record/schema_dumper.rb` at line 123](https://github.com/rails/rails/blob/master/activerecord/lib/active_record/schema_dumper.rb#L121)
## Possible solutions
1. Modify `pk_and_sequence_for` method in [`activerecord/lib/active_record/connection_adapters/postgresql/schema_statements.rb:362`](https://github.com/rails/rails/blob/master/activerecord/lib/active_record/connection_adapters/postgresql/schema_statements.rb#L362)
   
   ``` ruby
    if (result.nil? or result.empty?) and respond_to?(:primary_key)
      return [primary_key(table), nil]
    end
   ```
   
    This will fix it, but in #10451 it have been said, that "it appears to be intended to return nil if the primary key is not associated with a sequence". But there is `[pk, nil]` returning somewhere, so don't know.
   
    I think it's best solution.
2. Modify the same file and method, but on [line 358](https://github.com/rails/rails/blob/master/activerecord/lib/active_record/connection_adapters/postgresql/schema_statements.rb#L358) add the `gen_random_uuid` part to regexp in SQL query. This will fix only this particular scenario. Dislike it.
3. Modify [`activerecord/lib/active_record/schema_dumper.rb` at line 121](https://github.com/rails/rails/blob/master/activerecord/lib/active_record/schema_dumper.rb#L121), replace following:
   
   ``` ruby
    if @connection.respond_to?(:pk_and_sequence_for)
      pk, _ = @connection.pk_and_sequence_for(table)
    elsif @connection.respond_to?(:primary_key)
      pk = @connection.primary_key(table)
    end
   ```
   
   with something like this:
   
   ``` ruby
      if @connection.respond_to?(:pk_and_sequence_for)
        pk, _ = @connection.pk_and_sequence_for(table)
      if !pk && @connection.respond_to?(:primary_key)
        pk = @connection.primary_key(table)
      end
   ```
   
   This will fix only schema dumper.

I can implement one of these solutions and open a pull request.

