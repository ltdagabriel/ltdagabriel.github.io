---
title: Datetime with precision value is logged without precision
labels: activerecord, stale
layout: issue
---

While investigating #22381

In Rails master branch Datetime with precision bind value is logged without precision, like `[["start", 2000-01-01 12:30:00 UTC]]`.

``` ruby
D, [2015-11-24T18:41:27.137570 #3509] DEBUG -- :   SQL (0.2ms)  INSERT INTO "foos" ("start") VALUES (?)  [["start", 2000-01-01 12:30:00 UTC]]
```

``` ruby
begin
  require 'bundler/inline'
rescue LoadError => e
  $stderr.puts 'Bundler version 1.10 or later is required. Please update your Bundler'
  raise e
end

gemfile(true) do
  source 'https://rubygems.org'
  gem 'rails', github: 'rails/rails'
  gem 'arel', github: 'rails/arel'
  gem 'rack', github: 'rack/rack'
  gem 'sprockets', github: 'rails/sprockets'
  gem 'sprockets-rails', github: 'rails/sprockets-rails'
  gem 'sass-rails', github: 'rails/sass-rails'
  gem 'sqlite3'
end

require 'active_record'
require 'minitest/autorun'
require 'logger'

# Ensure backward compatibility with Minitest 4
Minitest::Test = MiniTest::Unit::TestCase unless defined?(Minitest::Test)

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: ':memory:')
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :foos, force: true do |t|
    t.time :start, precision: 6
  end
end

class Foo < ActiveRecord::Base
end

class BugTest < Minitest::Test
  def test_association_stuff
    time = ::Time.utc(2000, 1, 1, 12, 30, 0, 999999)
    post = Foo.create!(start: time)
  end
end
```

In Rails 4.2.5 it logs like `[["start", "2000-01-01 12:30:00.999999"]]` with precision. 

``` ruby
D, [2015-11-24T18:42:43.555872 #3978] DEBUG -- :   SQL (0.2ms)  INSERT INTO "foos" ("start") VALUES (?)  [["start", "2000-01-01 12:30:00.999999"]]
```

It also reproduces with postgresql adapter which `supports_datetime_with_precision?` returns true.

