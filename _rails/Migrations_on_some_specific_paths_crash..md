---
title: Migrations on some specific paths crash.
labels: activerecord
layout: issue
---

How to reproduce:

```
mkdir 10_urban
cd 10_urban
rails new library
# change Gemfile to include therubyracer
bundle
rails g scaffold author name:string
rake db:migrate
```

```
rake aborted!
An error has occurred, this and all later migrations canceled:

undefined method `migrate' for #<Object:0x000000033811e0>
/usr/local/rvm/gems/ruby-1.9.2-p320/gems/activerecord-3.2.8/lib/active_record/migration.rb:528:in `migrate'
/usr/local/rvm/gems/ruby-1.9.2-p320/gems/activerecord-3.2.8/lib/active_record/migration.rb:720:in `block (2 levels) in migrate'
/usr/local/rvm/gems/ruby-1.9.2-p320/gems/activerecord-3.2.8/lib/active_record/migration.rb:775:in `call'
/usr/local/rvm/gems/ruby-1.9.2-p320/gems/activerecord-3.2.8/lib/active_record/migration.rb:775:in `block in ddl_transaction'
/usr/local/rvm/gems/ruby-1.9.2-p320/gems/activerecord-3.2.8/lib/active_record/connection_adapters/abstract/database_statements.rb:192:in `transaction'
/usr/local/rvm/gems/ruby-1.9.2-p320/gems/activerecord-3.2.8/lib/active_record/transactions.rb:208:in `transaction'
/usr/local/rvm/gems/ruby-1.9.2-p320/gems/activerecord-3.2.8/lib/active_record/migration.rb:775:in `ddl_transaction'
/usr/local/rvm/gems/ruby-1.9.2-p320/gems/activerecord-3.2.8/lib/active_record/migration.rb:719:in `block in migrate'
/usr/local/rvm/gems/ruby-1.9.2-p320/gems/activerecord-3.2.8/lib/active_record/migration.rb:700:in `each'
/usr/local/rvm/gems/ruby-1.9.2-p320/gems/activerecord-3.2.8/lib/active_record/migration.rb:700:in `migrate'
/usr/local/rvm/gems/ruby-1.9.2-p320/gems/activerecord-3.2.8/lib/active_record/migration.rb:570:in `up'
/usr/local/rvm/gems/ruby-1.9.2-p320/gems/activerecord-3.2.8/lib/active_record/migration.rb:551:in `migrate'
/usr/local/rvm/gems/ruby-1.9.2-p320/gems/activerecord-3.2.8/lib/active_record/railties/databases.rake:153:in `block (2 levels) in <top (required)>'
Tasks: TOP => db:migrate
(See full trace by running task with --trace)
```

The problem stems from the Regexp used to match the migration name:

```
file.scan(/([0-9]+)_([_a-z0-9]*)\.?([_a-z0-9]*)?.rb/).first
```

The last dot should be escaped and, in my opinion, the regexp should match the end of the string as well. So the regexp should look as follows:

```
/([0-9]+)_([_a-z0-9]*)\.?([_a-z0-9]*)?\.rb\z/
```

