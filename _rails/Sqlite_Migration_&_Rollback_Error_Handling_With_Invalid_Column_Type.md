---
title: Sqlite3 Migration & Rollback Error Handling With Invalid Column Type
labels: activerecord, attached PR
layout: issue
---

### Steps to reproduce

Use Sqlite3 and create a table.  Add a column to the table with an invalid type argument.  The migration will run successfully.  Notice that 'db/schema.rb' will not work.  Run rake db:rollback, or generate a new migration to remove this column, and it will throw an error.  Code to reproduce the error:  

``` Ruby
begin
  require "bundler/inline"
rescue LoadError => e
  $stderr.puts "Bundler version 1.10 or later is required. Please update your Bundler"
  raise e
end

gemfile(true) do
  source "https://rubygems.org"
  # Activate the gem you are reporting the issue against.
  gem "activerecord", "5.0.0"
  gem "sqlite3"
end

require "active_record"
require "minitest/autorun"
require "logger"

# Ensure backward compatibility with Minitest 4
Minitest::Test = MiniTest::Unit::TestCase unless defined?(Minitest::Test)

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: "sqlite3", database: ":memory:")
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :stuff, force: true do |t|
    t.integer :number
    t.string :string
  end
  add_column :stuff, :foo, :bar
end

class BugTest < Minitest::Test
  def test_rollback_issue
    ActiveRecord::Schema.define do
      remove_column :stuff, :foo, :bar
    end
  end
end  
```
### Expected behavior

Rails should either catch the bad column type on the initial addition of the column or it should defer to the DB for error handling (as I expect it has been designed to do).  However if the DB allows this to be rolled back,  Rails should not prevent this.
### Actual behavior

Rails throws an error on rollback attempt in what appears to be the schema generation process and the change is not made.  The only solution seems to be to drop the table. 
### System configuration

**Rails version**:  5.1.0.alpha (also tested in 5.0.0 and 4.2.6)

**Ruby version**: 2.3.1p112

