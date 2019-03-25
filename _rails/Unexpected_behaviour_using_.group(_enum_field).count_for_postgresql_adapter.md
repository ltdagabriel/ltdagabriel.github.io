---
title: Unexpected behaviour using .group(:enum_field).count for postgresql adapter
labels: activerecord, enum
layout: issue
---

### Steps to reproduce

``` ruby
require 'minitest/autorun'
require 'rack/test'
require 'active_record'
require 'logger'

ActiveRecord::Base.establish_connection(adapter: 'postgresql', database: 'some_db')
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :tickets, force: true do |t|
    t.integer "priority"
  end
end

class Ticket < ActiveRecord::Base
  enum priority: [:high, :middle, :low]
end

class BugTest < Minitest::Test
  include Rack::Test::Methods

  def test_returns_success
    Ticket.create!(priority: :high)
    assert_equal({"high" => 1}, Ticket.group(:priority).count)
  end
end
```

But if i change adapter to mysql2 or sqlite3 everything work as expected
### Expected behavior

``` ruby
Ticket.group(:priority).count
#=> {'high'=>1}
```
### Actual behavior

``` ruby
Ticket.group(:priority).count
#=> {0=>1}
```
### System configuration

**Rails version**: 5.0.0.rc2

**Ruby version**: ruby 2.3.1p112 (2016-04-26 revision 54768) [x86_64-linux]

