---
title: Different timestamp precision in activerecord where queries depending on whether a string or map is used 
labels: With reproduction steps, activerecord
layout: issue
---

May be related to #19223

There seems to be a lot of issues surrounding time precision when using mysql 5.6 and Rails 4.2. This particular issue is seen with mysql2 0.3.18, Rails 4.2.1, and mysql 5.6.23.

Here is a straightforward example:

```
(byebug) User.where(created_at: Time.now).to_sql
"SELECT `users`.* FROM `users` WHERE `users`.`created_at` = '2015-04-09 17:35:58'"
(byebug) User.where('created_at = ?', Time.now).to_sql
"SELECT `users`.* FROM `users` WHERE (created_at = '2015-04-09 17:36:11.234855')"
```

The first query uses second precision, and the second uses millisecond precision.

