---
title: ActiveRecord::QueryMethods#from no longer escapes mysql attributes
labels: activerecord
layout: issue
---

The release of Rails 4.2.1 breaks subqueries with columns that match reserved keywords.
## Script to reproduce

``` ruby
unless File.exist?('Gemfile')
  File.write('Gemfile', <<-GEMFILE)
    source 'https://rubygems.org'
    gem 'rails', '4.2.1' # works with '4.2.0'
    gem 'mysql2'
  GEMFILE

  system 'bundle'
end

require 'bundler'
Bundler.setup(:default)

require 'active_record'
require 'minitest/autorun'
require 'logger'

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: 'mysql2',
                                        host: 'localhost',
                                        username: 'user',
                                        password: 'password',
                                        database: 'test')
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :test, force: true  do |t|
    t.integer :desc
  end
end

class Test < ActiveRecord::Base
  self.table_name = :test

  default_scope { select(:desc) }
end

class BugTest < Minitest::Test
  def test_from_escaping_attributes
    Test.create!(desc: 10)
    Test.create!(desc: 11)

    result = Test.from(Test.where(desc: 10), Test.table_name)

    assert_equal 1, result.to_a.size
  end
end
```
### Rails 4.2.0

In rails 4.2.0 this will generate a query that looks like this

``` SQL
SELECT `test`.`desc` FROM (SELECT `test`.`desc` FROM `test` WHERE `test`.`desc` = 10) test
```

Notice that the value in the select are properly escaped with backticks and fully qualified with the name of the subquery
### Rails 4.2.1

In rails 4.2.1 it will generate a query that looks like this

``` SQL
SELECT desc FROM (SELECT `test`.`desc` FROM `test` WHERE `test`.`desc` = 10) test
```

Notice how both the escaping and the qualifying of the attribute with the name of the subquery is not present. Because the `desc` column is not escaped this will cause a SQL error

```
You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'desc FROM (SELECT `test`.`desc` FROM `test` WHERE `test`.`desc` = 10) test' at line 1: SELECT desc FROM (SELECT `test`.`desc` FROM `test` WHERE `test`.`desc` = 10) test
```
### Suggested fix

Revert this behaviour back to escaping and fully qualifying the attributes when selecting from a subquery

