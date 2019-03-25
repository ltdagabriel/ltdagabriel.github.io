---
title: ActiveRecord: abstract_mysql_adapter and charset
labels: activerecord
layout: issue
---

Hi,

Using mysql2 gem and activerecord, some queries fail. I may have troubles with my MySQL (misencoded values, double utf-8 encode, etc) but I don't know where is the problem.

Here is the stacktrace :

```
    ArgumentError - invalid byte sequence in UTF-8:
      /var/www/api/shared/bundle/ruby/1.9.1/gems/activerecord-3.2.3/lib/active_record/connection_adapters/abstract_mysql_adapter.rb:246:in `split'
      /var/www/api/shared/bundle/ruby/1.9.1/gems/activerecord-3.2.3/lib/active_record/connection_adapters/abstract_mysql_adapter.rb:246:in `rescue in execute'
      /var/www/api/shared/bundle/ruby/1.9.1/gems/activerecord-3.2.3/lib/active_record/connection_adapters/abstract_mysql_adapter.rb:240:in `execute'
      /var/www/api/shared/bundle/ruby/1.9.1/gems/activerecord-3.2.3/lib/active_record/connection_adapters/mysql2_adapter.rb:211:in `execute'
      /var/www/api/shared/bundle/ruby/1.9.1/gems/activerecord-3.2.3/lib/active_record/connection_adapters/mysql2_adapter.rb:215:in `exec_query'
      /var/www/api/shared/bundle/ruby/1.9.1/gems/activerecord-3.2.3/lib/active_record/connection_adapters/mysql2_adapter.rb:224:in `select'
      /var/www/api/shared/bundle/ruby/1.9.1/gems/activerecord-3.2.3/lib/active_record/connection_adapters/abstract/database_statements.rb:18:in `select_all'
      /var/www/api/shared/bundle/ruby/1.9.1/gems/activerecord-3.2.3/lib/active_record/connection_adapters/abstract/query_cache.rb:63:in `select_all'
      /var/www/api/shared/bundle/ruby/1.9.1/gems/activerecord-3.2.3/lib/active_record/querying.rb:38:in `block in find_by_sql'
```

From Gemfile.lock:

```
rails (3.2.3)
  actionmailer (= 3.2.3)
  actionpack (= 3.2.3)
  activerecord (= 3.2.3)
  activeresource (= 3.2.3)
  activesupport (= 3.2.3)
  bundler (~> 1.0)
  railties (= 3.2.3)
mysql2 (0.3.11)
```

MySQL server encoding: UTF-8 Unicode (utf8)
Tables encoding: latin1_swedish_ci
Data inserted with charset utf-8

I know that I should fix this but I think the error message should be a little bit better. Why only some queries fail ?

Thanks,
Guillaume

