---
title: where ignores keys if values are empty hashes
labels: activerecord
layout: issue
---

In version 3.2.6:

```
User.where(:token => {}).first

    User Load (0.3ms)  SELECT "users".* FROM "users" LIMIT 1
```

This may lead to trouble if I check for, say, `params[:token`] to exist but not for it to be nonblank.

