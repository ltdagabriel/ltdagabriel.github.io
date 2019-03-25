---
title: enum scope generates wrong SQL WHERE condition when using nil as an enum value
labels: With reproduction steps, activerecord, attached PR
layout: issue
---

### Context and TL;DR
I'm trying to put rails on top of a legacy DB.
This DB stores enumerated status information in the `tp_Measure.Disposal_Unit` column (as `Integer`).
Some of these enum values are `NULL` instead of an `int`. When calling the class scope for the values that are `NULL`, the generated `WHERE` statement checks equality with `= NULL` instead of `IS NULL`.

I am aware that this may be a very rare use case and would like to know if others have had this problem as well, or if the enum implementation is not supposed to handle this case.

Below you'll find code to describe the issue in more detail. If you think that this might really be a bug, I'll gladly prepare a test case and/or reproduction scenario.

### Steps to reproduce
Create a class that has an enum where one enum value is `nil` instead of an int or string.
Create some records of this class that have `nil` as their enum value.
```ruby
class Measure < ApplicationRecord
  self.table_name = 'tp_Measure'

  alias_attribute :disposal_unit, :Disposal_Unit

  enum disposal_unit: {
    cubic_meter: 1,
    tons: 2,
    no_data: 0,
    nothing: nil
  }
end
```

### Expected behavior
When calling the generated scopes, the generated SQL statement should consider the possibility that instead of a correctly set enum value, the DB value might be `nil`, and therefore generate the following `WHERE` condition:

```ruby
irb(main):017:0> Measure.nothing
  Measure Load (1.4ms)  SELECT `tp_Measure`.* FROM `tp_Measure` WHERE `tp_Measure`.`Disposal_Unit` IS NULL
=> #<ActiveRecord::Relation [#<Measure ... >, #<Measure ... >, ...]>
```

### Actual behavior
Currently, it is just assumed that the enum DB column only contains enum values and it is always possible to query the DB with the `=` operator.

When calling the generated class scope `Measure.nothing`:
```ruby
irb(main):017:0> Measure.nothing
  Measure Load (1.4ms)  SELECT `tp_Measure`.* FROM `tp_Measure` WHERE `tp_Measure`.`Disposal_Unit` = NULL
=> #<ActiveRecord::Relation []>
```

### System configuration
**Rails version**: 5.0.2
**ActiveRecord version**: 5.0.2
**Ruby version**: ruby 2.4.0p0 (2016-12-24 revision 57164) [x86_64-darwin16]

