---
title: rake test:prepare fails with 4.0.0.rc1
labels: activerecord
layout: issue
---

I'm feeling quite bad reporting this as it sounds at first like a support query, but I verified that  it's triggered by the update from 4.0.0.beta1 to rc1 and it's such a basic problem that I have no idea how to continue debugging this myself.

While I'm still porting our app to Rails 4, the update to rc1 made things much worse - I can't even start testing as rake aborts before the first test runs.

This is what I get with rc1:

```
coolo@xanthippe#api>rm log/*; rake --trace
** Invoke default (first_time)                                                                                                     
** Invoke test (first_time)                                                                                                        
** Execute test                                                                                                                    
** Invoke test:run (first_time)                                                                                                    
** Invoke test:units (first_time)                                                                                                  
** Invoke test:prepare (first_time)                                                                                                
** Invoke db:test:prepare (first_time)                                                                                             
** Execute db:test:prepare
** Invoke db:test:load (first_time)
** Invoke db:test:purge (first_time)
** Invoke environment (first_time)
** Execute environment
** Invoke db:load_config (first_time)
** Execute db:load_config
** Execute db:test:purge
** Execute db:test:load
** Invoke db:test:load_structure (first_time)
** Invoke db:test:purge 
** Execute db:test:load_structure
** Invoke db:structure:load (first_time)
** Invoke environment 
** Invoke db:load_config 
** Execute db:structure:load
** Invoke db:abort_if_pending_migrations (first_time)
** Invoke environment 
** Execute db:abort_if_pending_migrations
rake aborted!
Mysql2::Error: No database selected: SHOW TABLES LIKE 'schema_migrations'
/usr/lib64/ruby/gems/2.0.0/gems/activerecord-4.0.0.rc1/lib/active_record/connection_adapters/abstract_mysql_adapter.rb:286:in `query'
/usr/lib64/ruby/gems/2.0.0/gems/activerecord-4.0.0.rc1/lib/active_record/connection_adapters/abstract_mysql_adapter.rb:286:in `block in execute'
/usr/lib64/ruby/gems/2.0.0/gems/activerecord-4.0.0.rc1/lib/active_record/connection_adapters/abstract_adapter.rb:425:in `block in log'
/usr/lib64/ruby/gems/2.0.0/gems/activesupport-4.0.0.rc1/lib/active_support/notifications/instrumenter.rb:20:in `instrument'
/usr/lib64/ruby/gems/2.0.0/gems/activerecord-4.0.0.rc1/lib/active_record/connection_adapters/abstract_adapter.rb:420:in `log'
/usr/lib64/ruby/gems/2.0.0/gems/activerecord-4.0.0.rc1/lib/active_record/connection_adapters/abstract_mysql_adapter.rb:286:in `execute'
/usr/lib64/ruby/gems/2.0.0/gems/activerecord-4.0.0.rc1/lib/active_record/connection_adapters/mysql2_adapter.rb:220:in `execute'
/usr/lib64/ruby/gems/2.0.0/gems/activerecord-4.0.0.rc1/lib/active_record/connection_adapters/abstract_mysql_adapter.rb:300:in `execute_and_free'
/usr/lib64/ruby/gems/2.0.0/gems/activerecord-4.0.0.rc1/lib/active_record/connection_adapters/abstract_mysql_adapter.rb:412:in `tables'
/usr/lib64/ruby/gems/2.0.0/gems/activerecord-4.0.0.rc1/lib/active_record/connection_adapters/abstract_mysql_adapter.rb:419:in `table_exists?'
/usr/lib64/ruby/gems/2.0.0/gems/activerecord-4.0.0.rc1/lib/active_record/schema_migration.rb:17:in `create_table'
/usr/lib64/ruby/gems/2.0.0/gems/activerecord-4.0.0.rc1/lib/active_record/migration.rb:857:in `initialize'
/usr/lib64/ruby/gems/2.0.0/gems/activerecord-4.0.0.rc1/lib/active_record/migration.rb:762:in `new'
/usr/lib64/ruby/gems/2.0.0/gems/activerecord-4.0.0.rc1/lib/active_record/migration.rb:762:in `open'
/usr/lib64/ruby/gems/2.0.0/gems/activerecord-4.0.0.rc1/lib/active_record/railties/databases.rake:164:in `block (2 levels) in <top (required)>'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:246:in `call'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:246:in `block in execute'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:241:in `each'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:241:in `execute'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:184:in `block in invoke_with_call_chain'
/usr/lib64/ruby/2.0.0/monitor.rb:211:in `mon_synchronize'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:177:in `invoke_with_call_chain'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:205:in `block in invoke_prerequisites'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:203:in `each'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:203:in `invoke_prerequisites'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:183:in `block in invoke_with_call_chain'
/usr/lib64/ruby/2.0.0/monitor.rb:211:in `mon_synchronize'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:177:in `invoke_with_call_chain'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:205:in `block in invoke_prerequisites'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:203:in `each'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:203:in `invoke_prerequisites'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:183:in `block in invoke_with_call_chain'
/usr/lib64/ruby/2.0.0/monitor.rb:211:in `mon_synchronize'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:177:in `invoke_with_call_chain'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:205:in `block in invoke_prerequisites'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:203:in `each'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:203:in `invoke_prerequisites'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:183:in `block in invoke_with_call_chain'
/usr/lib64/ruby/2.0.0/monitor.rb:211:in `mon_synchronize'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:177:in `invoke_with_call_chain'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:170:in `invoke'
/usr/lib64/ruby/gems/2.0.0/gems/railties-4.0.0.rc1/lib/rails/test_unit/testing.rake:61:in `block in <top (required)>'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:246:in `call'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:246:in `block in execute'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:241:in `each'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:241:in `execute'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:184:in `block in invoke_with_call_chain'
/usr/lib64/ruby/2.0.0/monitor.rb:211:in `mon_synchronize'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:177:in `invoke_with_call_chain'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:205:in `block in invoke_prerequisites'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:203:in `each'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:203:in `invoke_prerequisites'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:183:in `block in invoke_with_call_chain'
/usr/lib64/ruby/2.0.0/monitor.rb:211:in `mon_synchronize'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:177:in `invoke_with_call_chain'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/task.rb:170:in `invoke'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/application.rb:143:in `invoke_task'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/application.rb:101:in `block (2 levels) in top_level'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/application.rb:101:in `each'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/application.rb:101:in `block in top_level'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/application.rb:110:in `run_with_threads'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/application.rb:95:in `top_level'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/application.rb:73:in `block in run'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/application.rb:160:in `standard_exception_handling'
/usr/lib64/ruby/gems/2.0.0/gems/rake-10.0.4/lib/rake/application.rb:70:in `run'
/usr/bin/rake:37:in `<main>'
Tasks: TOP => test:run => test:units => test:prepare => db:abort_if_pending_migrations

The log file does not reveal much more:

   (931.0ms)  DROP DATABASE IF EXISTS `ci_api_test`
   (0.6ms)  CREATE DATABASE `ci_api_test` DEFAULT CHARACTER SET `utf8` COLLATE `utf8_unicode_ci`
Mysql2::Error: No database selected: SHOW TABLES LIKE 'schema_migrations'


The same command on beta1:

coolo@xanthippe#api>rm log/*; rake --trace
** Invoke default (first_time)
** Invoke test (first_time)
** Execute test
** Invoke test:run (first_time)
** Execute test:run
** Invoke test:units (first_time)
** Invoke test:prepare (first_time)
** Invoke db:test:prepare (first_time)
** Invoke db:abort_if_pending_migrations (first_time)
** Invoke environment (first_time)
** Execute environment
** Invoke db:load_config (first_time)
** Execute db:load_config
** Execute db:abort_if_pending_migrations
** Execute db:test:prepare
** Invoke db:test:load (first_time)
** Invoke db:test:purge (first_time)
** Invoke environment 
** Invoke db:load_config 
** Execute db:test:purge
** Execute db:test:load
** Invoke db:test:load_structure (first_time)
** Invoke db:test:purge 
** Execute db:test:load_structure
** Invoke db:structure:load (first_time)
** Invoke environment 
** Invoke db:load_config 
** Execute db:structure:load
** Execute test:prepare
** Execute test:units
Run options: --seed 15594
```

I have no idea what makes our app special - I use minitest, mysql2 and rails-api (but I already checked, switching to rails does not resolve the problem).

I'm filing this issue mainly in hope that it's a generic problem that helps others too. But as I said: I have no idea how to start tackling this from my side.

