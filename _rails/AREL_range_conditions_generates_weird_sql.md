---
title: AREL range conditions generates weird sql
labels: activerecord, attached PR
layout: issue
---

```
1.9.3p327 :001 > User.where(:created_at => [3.days.ago..2.days.ago]).to_sql
 => "SELECT `users`.* FROM `users`  WHERE (users.deleted_at IS NULL) AND ((`users`.`created_at` BETWEEN '2013-02-01 13:06:35' AND '2013-02-02 13:06:35' OR `users`.`created_at` IN (NULL)))"

User.where(1==1).to_sql
 => "SELECT `users`.* FROM `users`  WHERE (users.deleted_at IS NULL) AND (1)"
```

Why it adds `created_at IN (NULL)` ? Seems it's not documented and I don't see much sense in it.

Yes, users.created_at column defined as `datetime default NULL`

Rails 3.2.11

