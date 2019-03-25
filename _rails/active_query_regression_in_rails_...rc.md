---
title: active query regression in rails 4.0.1.rc1
labels: regression
layout: issue
---

The following code works in rails 4.0.0 and should work (as far as I can tell).

``` ruby
class CompanyRole < ActiveRecord::Base
  ...
  has_many :planned_communications_as_target,
    as: :communication_target,
    class_name: "PlannedCommunication"

  has_many :indirect_planned_communications_as_target,
    through: :company_role_contacts,
    class_name: "PlannedCommunication",
    source: :planned_communications_as_target

  def all_planned_communications_as_target
    PlannedCommunication.where(
      "id in (?) OR id in (?)",
      planned_communications_as_target,
      indirect_planned_communications_as_target
    )
  end

end
```

From the console:

```
> CustomerProspect.find(1).all_planned_communications_as_target.count
```

Here's the SQL:

``` sql
SELECT COUNT(*) FROM "planned_communications" WHERE (id in (SELECT "planned_communications".* FROM "planned_communications" WHERE "planned_communications"."communication_target_id" = $1 AND "planned_communications"."communication_target_type" = $2) OR id in (SELECT "planned_communications".* FROM "planned_communications" INNER JOIN "company_role_contacts" ON "planned_communications"."communication_target_id" = "company_role_contacts"."id" AND "planned_communications"."communication_target_type" = 'CompanyRoleContact' WHERE "company_role_contacts"."company_role_id" = $1))
```

Here's the error:

```
PG::UndefinedParameter: ERROR:  there is no parameter $1
LINE 1: ...anned_communications"."communication_target_id" = $1 AND "pl...
```

And the backtrace:

```
  from /Users/seandevine/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/activerecord-4.0.1.rc1/lib/active_record/connection_adapters/postgresql_adapter.rb:774:in `exec'
  from /Users/seandevine/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/activerecord-4.0.1.rc1/lib/active_record/connection_adapters/postgresql_adapter.rb:774:in `exec_no_cache'
  from /Users/seandevine/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/activerecord-4.0.1.rc1/lib/active_record/connection_adapters/postgresql/database_statements.rb:138:in `block in exec_query'
  from /Users/seandevine/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/activerecord-4.0.1.rc1/lib/active_record/connection_adapters/abstract_adapter.rb:435:in `block in log'
  from /Users/seandevine/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/activesupport-4.0.1.rc1/lib/active_support/notifications/instrumenter.rb:20:in `instrument'
  from /Users/seandevine/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/activerecord-4.0.1.rc1/lib/active_record/connection_adapters/abstract_adapter.rb:430:in `log'
  from /Users/seandevine/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/activerecord-4.0.1.rc1/lib/active_record/connection_adapters/postgresql/database_statements.rb:137:in `exec_query'
  from /Users/seandevine/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/activerecord-4.0.1.rc1/lib/active_record/connection_adapters/postgresql_adapter.rb:891:in `select'
  from /Users/seandevine/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/activerecord-4.0.1.rc1/lib/active_record/connection_adapters/abstract/database_statements.rb:24:in `select_all'
  from /Users/seandevine/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/activerecord-4.0.1.rc1/lib/active_record/connection_adapters/abstract/query_cache.rb:63:in `select_all'
  from /Users/seandevine/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/activerecord-4.0.1.rc1/lib/active_record/relation/calculations.rb:262:in `execute_simple_calculation'
  from /Users/seandevine/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/activerecord-4.0.1.rc1/lib/active_record/relation/calculations.rb:224:in `perform_calculation'
  from /Users/seandevine/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/activerecord-4.0.1.rc1/lib/active_record/relation/calculations.rb:108:in `calculate'
  from /Users/seandevine/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/activerecord-deprecated_finders-1.0.3/lib/active_record/deprecated_finders/relation.rb:84:in `calculate'
  from /Users/seandevine/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/activerecord-4.0.1.rc1/lib/active_record/relation/calculations.rb:24:in `count'
  from (irb):21
  from /Users/seandevine/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/railties-4.0.1.rc1/lib/rails/commands/console.rb:90:in `start'
  from /Users/seandevine/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/railties-4.0.1.rc1/lib/rails/commands/console.rb:9:in `start'
  from /Users/seandevine/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/railties-4.0.1.rc1/lib/rails/commands.rb:62:in `<top (required)>'
```

