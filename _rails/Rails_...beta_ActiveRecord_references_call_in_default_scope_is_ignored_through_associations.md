---
title: Rails 4.2.0.beta1: ActiveRecord references call in default_scope is ignored through associations
labels: activerecord, attached PR, release blocker
layout: issue
---

I'm seeing a bunch of errors in my test suite for this line of code:

``` ruby
class DistrictCourse < ActiveRecord::Base
  default_scope ->{includes([:state_course, :primary_subject_area, :district]).order('enabled desc, state_courses.name').references(:state_course) }
end
```

This is the error:

```
ActiveRecord::StatementInvalid: Mysql2::Error: Unknown column 'state_courses.name' in 'order clause': SELECT  `district_courses`.* FROM `district_courses` WHERE `district_courses`.`id` = 980190962  ORDER BY enabled desc, state_courses.name LIMIT 1
```

I thought `references` was added specifically to make sure its argument's table would be included in the query?

