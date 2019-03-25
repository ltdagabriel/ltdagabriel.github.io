---
title: Reader / predicate returning different values for boolean field
labels: activerecord, attached PR, enum
layout: issue
---

``` ruby
[33] pry(main)> UserTask.find(13511).task.counselor
  UserTask Load (1.9ms)  SELECT  "user_tasks".* FROM "user_tasks"  WHERE "user_tasks"."id" = $1 LIMIT 1  [["id", 13511]]
  TaskItem Load (0.7ms)  SELECT  "task_items".* FROM "task_items"  WHERE "task_items"."id" = $1 LIMIT 1  [["id", 241]]
=> false
[34] pry(main)> UserTask.find(13511).task.counselor?
  UserTask Load (0.9ms)  SELECT  "user_tasks".* FROM "user_tasks"  WHERE "user_tasks"."id" = $1 LIMIT 1  [["id", 13511]]
  TaskItem Load (1.0ms)  SELECT  "task_items".* FROM "task_items"  WHERE "task_items"."id" = $1 LIMIT 1  [["id", 241]]
=> true
```

``` ruby
[6] pry(main)> UserTask.find(13511).task.id
  UserTask Load (1.0ms)  SELECT  "user_tasks".* FROM "user_tasks"  WHERE "user_tasks"."id" = $1 LIMIT 1  [["id", 13511]]
  TaskItem Load (1.0ms)  SELECT  "task_items".* FROM "task_items"  WHERE "task_items"."id" = $1 LIMIT 1  [["id", 241]]
=> 241
[7] pry(main)> TaskItem.find(241).counselor?
  TaskItem Load (1.1ms)  SELECT  "task_items".* FROM "task_items"  WHERE "task_items"."id" = $1 LIMIT 1  [["id", 241]]
=> true
[8] pry(main)> TaskItem.find(241).counselor
  TaskItem Load (0.9ms)  SELECT  "task_items".* FROM "task_items"  WHERE "task_items"."id" = $1 LIMIT 1  [["id", 241]]
=> false
```
- The value on database is false
- The field is boolean
- Rails version: 4.1.6
- Ruby version: ruby 2.1.3p242 (2014-09-19 revision 47630) [x86_64-linux]
- PostgreSQL: 9.3

Is it a bug?

