---
title: ActiveRecord count doesn't work with joins().uniq properly
labels: activerecord
layout: issue
---

```
jruby-1.6.7 :060 > Employee.joins(:projects).uniq.all.size
  Employee Load (17.0ms)  
SELECT DISTINCT `employees`.* 
FROM `employees` 
INNER JOIN `assignments` ON `assignments`.`employee_id` = `employees`.`id` 
INNER JOIN `projects` ON `projects`.`id` = `assignments`.`project_id`
 => 87 

jruby-1.6.7 :061 > Employee.joins(:projects).uniq.count
   (4.0ms)  
SELECT DISTINCT COUNT(*) 
FROM `employees` 
INNER JOIN `assignments` ON `assignments`.`employee_id` = `employees`.`id` 
INNER JOIN `projects` ON `projects`.`id` = `assignments`.`project_id`
 => 910 
```

