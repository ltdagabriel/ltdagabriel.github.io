---
title: add_foreign_key with table_name_prefix causes ActiveRecord::StatementInvalid
labels: activerecord
layout: issue
---

This issue is reported as https://github.com/rsim/oracle-enhanced/issues/639.
- Summary
  When table_name_prefix is set to non-default value `add_foreign_key` without `:column` option causes `ActiveRecord::StatementInvalid` due to the target column name does not exist since this column name is affected by table_name_prefix, which should not.
- Environment
  rails master branch
  ruby 2.2.2p95 (2015-04-13 revision 50295) [x86_64-linux]
  MySQL 5.7.7-rc MySQL Community Server (GPL) or other databases whose adapter `supports_foreign_key` returns `true`
- How to reproduce with this commit https://github.com/yahonda/rails/commit/8284d7adc0b84f64b9be2792b74b000824ff05e9

``` ruby
$ git clone git@github.com:yahonda/rails.git
$ git checkout foreign_key_with_prefix
$ bundle
$ for i in mysql mysql2; do echo $i; ARCONN=$i ruby -Itest test/cases/migration/foreign_key_test.rb -n test_add_foreign_key_with_prefix; done
```
- Current output

``` ruby
$ for i in mysql mysql2; do echo $i; ARCONN=$i ruby -Itest test/cases/migration/foreign_key_test.rb -n test_add_foreign_key_with_prefix; done
mysql
Using mysql
Run options: -n test_add_foreign_key_with_prefix --seed 51112

# Running:

==  ActiveRecord::Migration::ForeignKeyTest::CreateCitiesAndHousesMigrationWithTableNamePrefix: migrating
-- create_table("cities")
   -> 0.0044s
-- create_table("houses")
   -> 0.0041s
-- add_foreign_key(:houses, :cities)
E

Finished in 0.034578s, 28.9201 runs/s, 0.0000 assertions/s.

  1) Error:
ActiveRecord::Migration::ForeignKeyTest#test_add_foreign_key_with_prefix:
ActiveRecord::StatementInvalid: Mysql::Error: Key column 'p_city_id' doesn't exist in table: ALTER TABLE `p_houses` ADD CONSTRAINT `fk_rails_1c59bb0788`
FOREIGN KEY (`p_city_id`)
  REFERENCES `p_cities` (`id`)

    /home/yahonda/work/rails/activerecord/lib/active_record/connection_adapters/abstract_mysql_adapter.rb:413:in `query'
    /home/yahonda/work/rails/activerecord/lib/active_record/connection_adapters/abstract_mysql_adapter.rb:413:in `block in execute'
    /home/yahonda/work/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:497:in `block in log'
    /home/yahonda/work/rails/activesupport/lib/active_support/notifications/instrumenter.rb:20:in `instrument'
    /home/yahonda/work/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:491:in `log'
    /home/yahonda/work/rails/activerecord/lib/active_record/connection_adapters/abstract_mysql_adapter.rb:413:in `execute'
    /home/yahonda/work/rails/activerecord/lib/active_record/connection_adapters/abstract/schema_statements.rb:777:in `add_foreign_key'
    /home/yahonda/work/rails/activerecord/lib/active_record/migration.rb:649:in `block in method_missing'
    /home/yahonda/work/rails/activerecord/lib/active_record/migration.rb:619:in `block in say_with_time'
    /home/yahonda/.rvm/rubies/ruby-2.2.2/lib/ruby/2.2.0/benchmark.rb:288:in `measure'
    /home/yahonda/work/rails/activerecord/lib/active_record/migration.rb:619:in `say_with_time'
    /home/yahonda/work/rails/activerecord/lib/active_record/migration.rb:639:in `method_missing'
    test/cases/migration/foreign_key_test.rb:253:in `change'
    /home/yahonda/work/rails/activerecord/lib/active_record/migration.rb:593:in `exec_migration'
    /home/yahonda/work/rails/activerecord/lib/active_record/migration.rb:577:in `block (2 levels) in migrate'
    /home/yahonda/.rvm/rubies/ruby-2.2.2/lib/ruby/2.2.0/benchmark.rb:288:in `measure'
    /home/yahonda/work/rails/activerecord/lib/active_record/migration.rb:576:in `block in migrate'
    /home/yahonda/work/rails/activerecord/lib/active_record/connection_adapters/abstract/connection_pool.rb:396:in `with_connection'
    /home/yahonda/work/rails/activerecord/lib/active_record/migration.rb:575:in `migrate'
    test/cases/migration/foreign_key_test.rb:260:in `test_add_foreign_key_with_prefix'

1 runs, 0 assertions, 0 failures, 1 errors, 0 skips
mysql2
Using mysql2
Run options: -n test_add_foreign_key_with_prefix --seed 35344

# Running:

==  ActiveRecord::Migration::ForeignKeyTest::CreateCitiesAndHousesMigrationWithTableNamePrefix: migrating
-- create_table("cities")
   -> 0.0035s
-- create_table("houses")
   -> 0.0057s
-- add_foreign_key(:houses, :cities)
E

Finished in 0.034449s, 29.0285 runs/s, 0.0000 assertions/s.

  1) Error:
ActiveRecord::Migration::ForeignKeyTest#test_add_foreign_key_with_prefix:
ActiveRecord::StatementInvalid: Mysql2::Error: Key column 'p_city_id' doesn't exist in table: ALTER TABLE `p_houses` ADD CONSTRAINT `fk_rails_1c59bb0788`
FOREIGN KEY (`p_city_id`)
  REFERENCES `p_cities` (`id`)

    /home/yahonda/work/rails/activerecord/lib/active_record/connection_adapters/abstract_mysql_adapter.rb:413:in `query'
    /home/yahonda/work/rails/activerecord/lib/active_record/connection_adapters/abstract_mysql_adapter.rb:413:in `block in execute'
    /home/yahonda/work/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:497:in `block in log'
    /home/yahonda/work/rails/activesupport/lib/active_support/notifications/instrumenter.rb:20:in `instrument'
    /home/yahonda/work/rails/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb:491:in `log'
    /home/yahonda/work/rails/activerecord/lib/active_record/connection_adapters/abstract_mysql_adapter.rb:413:in `execute'
    /home/yahonda/work/rails/activerecord/lib/active_record/connection_adapters/mysql2_adapter.rb:214:in `execute'
    /home/yahonda/work/rails/activerecord/lib/active_record/connection_adapters/abstract/schema_statements.rb:777:in `add_foreign_key'
    /home/yahonda/work/rails/activerecord/lib/active_record/migration.rb:649:in `block in method_missing'
    /home/yahonda/work/rails/activerecord/lib/active_record/migration.rb:619:in `block in say_with_time'
    /home/yahonda/.rvm/rubies/ruby-2.2.2/lib/ruby/2.2.0/benchmark.rb:288:in `measure'
    /home/yahonda/work/rails/activerecord/lib/active_record/migration.rb:619:in `say_with_time'
    /home/yahonda/work/rails/activerecord/lib/active_record/migration.rb:639:in `method_missing'
    test/cases/migration/foreign_key_test.rb:253:in `change'
    /home/yahonda/work/rails/activerecord/lib/active_record/migration.rb:593:in `exec_migration'
    /home/yahonda/work/rails/activerecord/lib/active_record/migration.rb:577:in `block (2 levels) in migrate'
    /home/yahonda/.rvm/rubies/ruby-2.2.2/lib/ruby/2.2.0/benchmark.rb:288:in `measure'
    /home/yahonda/work/rails/activerecord/lib/active_record/migration.rb:576:in `block in migrate'
    /home/yahonda/work/rails/activerecord/lib/active_record/connection_adapters/abstract/connection_pool.rb:396:in `with_connection'
    /home/yahonda/work/rails/activerecord/lib/active_record/migration.rb:575:in `migrate'
    test/cases/migration/foreign_key_test.rb:260:in `test_add_foreign_key_with_prefix'

1 runs, 0 assertions, 0 failures, 1 errors, 0 skips
$
```
- What I have found so far

When `add_foreign_key` executed without `options[:column]` specified the target column name is retrieved from `foreign_key_column_for` method. https://github.com/rails/rails/blob/master/activerecord/lib/active_record/connection_adapters/abstract/schema_statements.rb#L834-L836 

``` ruby
      def foreign_key_column_for(table_name) # :nodoc:
        "#{table_name.to_s.singularize}_id"
      end
```

In this method column name is based on the `table_name` argument, which is affected by table_name_prefix (and table_name_suffix, not included in this testcase yet). 
Here `p_city_id` should be `city_id` without the value of table_name_prefix.

Based on the naming `table_name_prefix` and `table_name_suffix`, I expect this changes just table name not column names. If there is a way to get the original table name to get the correct column name this issue can be resolved.

