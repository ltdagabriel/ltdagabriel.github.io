---
title: no_touching should bypass after_touch callback.
labels: activerecord, attached PR
layout: issue
---

Please see this [gist](https://gist.github.com/JuanitoFatas/11201897):

``` ruby
unless File.exist?('Gemfile')
  File.write('Gemfile', <<-GEMFILE)
    source 'https://rubygems.org'
    gem 'rails', github: 'rails/rails'
    gem 'sqlite3'
  GEMFILE

  system 'bundle'
end

require 'bundler'
Bundler.setup(:default)

require 'active_record'
require 'minitest/autorun'
require 'logger'

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: ':memory:')
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :users do |t|
    t.timestamps
  end
end

class User < ActiveRecord::Base
  after_touch do |user|
    puts "You have touched an object"
  end
end

class BugTest < Minitest::Test
  def test_no_touching_should_bypass_after_touch_callback
    user = User.create

    User.no_touching do
      user.touch
    end
  end
end
```

When I run this, I get the output `"You have touched an object"`:

``` sh
$ ruby no_touching.rb
-- create_table(:users)
D, [2014-04-23T11:24:18.800907 #30096] DEBUG -- :    (0.5ms)  CREATE TABLE "users" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "created_at" datetime, "updated_at" datetime)
   -> 0.0074s
Run options: --seed 36335

# Running:

D, [2014-04-23T11:24:18.829908 #30096] DEBUG -- :    (0.1ms)  begin transaction
D, [2014-04-23T11:24:18.839017 #30096] DEBUG -- :   SQL (0.2ms)  INSERT INTO "users" ("created_at", "updated_at") VALUES (?, ?)  [["created_at", "2014-04-23 03:24:18.832378"], ["updated_at", "2014-04-23 03:24:18.832378"]]
D, [2014-04-23T11:24:18.839395 #30096] DEBUG -- :    (0.1ms)  commit transaction
D, [2014-04-23T11:24:18.839637 #30096] DEBUG -- :    (0.1ms)  begin transaction
You have touched an object
D, [2014-04-23T11:24:18.839998 #30096] DEBUG -- :    (0.1ms)  rollback transaction
.

Finished in 0.015019s, 66.5823 runs/s, 0.0000 assertions/s.

1 runs, 0 assertions, 0 failures, 0 errors, 0 skips
```

I think `no_touching` should bypass the `after_touch` callback?

