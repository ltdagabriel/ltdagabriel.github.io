---
title: Incorrect changed for datetimes in mysql adapters
labels: activerecord
layout: issue
---

Hi guys, I've found a similar issue of #6591 in current rails 3-2-stable. Adding the following test to activerecord/test/cases/dirty_test.rb

``` ruby
  def test_setting_time_attributes_with_time_zone_field_to_same_time_should_not_be_marked_as_a_change
    in_time_zone 'Paris' do
      target = Class.new(ActiveRecord::Base)
      target.table_name = 'pirates'

      created_on = Time.now

      pirate = target.create(:created_on => created_on)
      pirate.reload # Here mysql truncate the usec value to 0

      pirate.created_on = created_on
      assert !pirate.created_on_changed?
    end
  end
```

I getting the following:

``` sh
ARCONN=mysql2 ruby -Itest test/cases/dirty_test.rb -n test_setting_time_attributes_with_time_zone_field_to_same_time_should_not_be_marked_as_a_changeUsing mysql2 with Identity Map off
Run options: -n test_setting_time_attributes_with_time_zone_field_to_same_time_should_not_be_marked_as_a_change

# Running tests:

F

Finished tests in 0.087599s, 11.4157 tests/s, 11.4157 assertions/s.

  1) Failure:
test_setting_time_attributes_with_time_zone_field_to_same_time_should_not_be_marked_as_a_change(DirtyTest) [test/cases/dirty_test.rb:104]:
Failed assertion, no message given.

1 tests, 1 assertions, 1 failures, 0 errors, 0 skips
```

``` sh
ARCONN=sqlite3 ruby -Itest test/cases/dirty_test.rb -n test_setting_time_attributes_with_time_zone_field_to_same_time_should_not_be_marked_as_a_change
Using sqlite3 with Identity Map off
Run options: -n test_setting_time_attributes_with_time_zone_field_to_same_time_should_not_be_marked_as_a_change

# Running tests:

.

Finished tests in 0.058396s, 17.1245 tests/s, 17.1245 assertions/s.

1 tests, 1 assertions, 0 failures, 0 errors, 0 skips
```

I have a clue in why this is happening due to the lack of precision of the Mysql databases. Mysql does not save micro seconds

Thanks in advance 

