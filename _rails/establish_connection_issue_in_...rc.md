---
title: establish_connection issue in 4.1.0.rc2
labels: activerecord, regression
layout: issue
---

In rc1 and previous versions of rails the way to set a model to connected to a different database was:

```
class User
  establish_connection ENV['DB_OTHER_URL']
end
```

This is no longer working and rails doesn't seem to be able to handle multiple databases.  It appears to just use the last connection that was made for all models.  Is there a new way to do this or a better option?

