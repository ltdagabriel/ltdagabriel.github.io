---
title: Queries are logged twice when using a STDOUT logger in the Rails 4 console
labels: activerecord, attached PR
layout: issue
---

I've found what I believe to be a regression in Active Record's logging behavior inside the Rails console in Rails 4. If I set `config.logger` to log to STDOUT, all the database queries logged to the console get logged twice.

Here are the steps to reproduce:

```
$ rails --version
Rails 4.0.0
$ rails new test_logger
$ cd test_logger

Edit config/environments/development.rb and add these two lines in the configure block:

config.logger = ActiveSupport::Logger.new(STDOUT)
config.logger.level = ActiveSupport::Logger.const_get(ENV['LOG_LEVEL'] ? ENV['LOG_LEVEL'].upcase : 'DEBUG')

$ rails g model User name:string
$ rake db:migrate

$ rails c
Loading development environment (Rails 4.0.0)
2.0.0-p247 :001 > User.first
  User Load (0.2ms)  SELECT "users".* FROM "users" ORDER BY "users"."id" ASC LIMIT 1
  User Load (0.2ms)  SELECT "users".* FROM "users" ORDER BY "users"."id" ASC LIMIT 1
 => nil 
2.0.0-p247 :002 > 
```

I expect the "User Load" line to appear only once, but it appears twice. I can reproduce the bug both in Rails 4.0.0 and the latest master at the time of this writing. Following the same steps using Rails 3.2.13 (substituting `Logger` for `ActiveSupport::Logger`), the console works as expected.

I have also tried using `Logger` with the Rails 4 app. When I do this, the query is still logged twice, once using Ruby's default `Formatter` (as I would expect) and once using Rails's custom `Formatter` (unexpected):

```
rails c
Loading development environment (Rails 4.0.0)
2.0.0-p247 :001 > User.first
  User Load (0.3ms)  SELECT "users".* FROM "users" ORDER BY "users"."id" ASC LIMIT 1
D, [2013-07-12T16:29:59.363272 #22484] DEBUG -- :   User Load (0.3ms)  SELECT "users".* FROM "users" ORDER BY "users"."id" ASC LIMIT 1
 => nil 
2.0.0-p247 :002 > 
```

Please let me know if there's anything else I can do to help with this bug.

