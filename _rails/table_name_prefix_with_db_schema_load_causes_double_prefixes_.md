---
title: table_name_prefix with db:schema:load causes double prefixes 
labels: activerecord, railties
layout: issue
---

I created a rails 3.1.3 application. And added table_name_prefix as 'pfx_' in config/application.rb. I also created a model user with name and address as table columns. Then run the db:create and db:migrate.
schema.rb file gets populated with the db dump having table prefix in table names. After then I tried to run my test cases which failed with the following error :

```
UsersControllerTest:
    ERROR should create user (0.02s) 
          ActiveRecord::StatementInvalid: Mysql2::Error: Table 'myapp_test.pfx_users' doesn't exist: SHOW FIELDS FROM `pfx_users`
          /home/ankit/.rvm/gems/ruby-1.9.2-p290/gems/activerecord-3.1.3/lib/active_record/connection_adapters/mysql2_adapter.rb:283:in `query'

    ERROR should destroy user (0.01s) 
          ActiveRecord::StatementInvalid: Mysql2::Error: Table 'myapp_test.pfx_users' doesn't exist: SHOW FIELDS FROM `pfx_users`
          /home/ankit/.rvm/gems/ruby-1.9.2-p290/gems/activerecord-3.1.3/lib/active_record/connection_adapters/mysql2_adapter.rb:283:in `query'

    ERROR should get edit (0.01s) 
          ActiveRecord::StatementInvalid: Mysql2::Error: Table 'myapp_test.pfx_users' doesn't exist: SHOW FIELDS FROM `pfx_users`
          /home/ankit/.rvm/gems/ruby-1.9.2-p290/gems/activerecord-3.1.3/lib/active_record/connection_adapters/mysql2_adapter.rb:283:in `query'

    ERROR should get index (0.01s) 
          ActiveRecord::StatementInvalid: Mysql2::Error: Table 'myapp_test.pfx_users' doesn't exist: SHOW FIELDS FROM `pfx_users`
          /home/ankit/.rvm/gems/ruby-1.9.2-p290/gems/activerecord-3.1.3/lib/active_record/connection_adapters/mysql2_adapter.rb:283:in `query'

    ERROR should get new (0.08s) 
          ActiveRecord::StatementInvalid: Mysql2::Error: Table 'myapp_test.pfx_users' doesn't exist: SHOW FIELDS FROM `pfx_users`
          /home/ankit/.rvm/gems/ruby-1.9.2-p290/gems/activerecord-3.1.3/lib/active_record/connection_adapters/mysql2_adapter.rb:283:in `query'

    ERROR should show user (0.01s) 
          ActiveRecord::StatementInvalid: Mysql2::Error: Table 'myapp_test.pfx_users' doesn't exist: SHOW FIELDS FROM `pfx_users`
          /home/ankit/.rvm/gems/ruby-1.9.2-p290/gems/activerecord-3.1.3/lib/active_record/connection_adapters/mysql2_adapter.rb:283:in `query'

    ERROR should update user (0.01s) 
          ActiveRecord::StatementInvalid: Mysql2::Error: Table 'myapp_test.pfx_users' doesn't exist: SHOW FIELDS FROM `pfx_users`
          /home/ankit/.rvm/gems/ruby-1.9.2-p290/gems/activerecord-3.1.3/lib/active_record/connection_adapters/mysql2_adapter.rb:283:in `query'
```

After debugging the issue I found that tables with double prefix, as 'pfx_pfx_users' gets created in the test database which is a blunder.

Please find the demo code on the following url : https://github.com/ankitenggcom/Myapp
Kindly look into this issue.

