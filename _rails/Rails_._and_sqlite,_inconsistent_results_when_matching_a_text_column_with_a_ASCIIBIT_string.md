---
title: Rails 4.2 and sqlite3, inconsistent results when matching a text column with a ASCII-8BIT string
labels: activerecord, needs feedback
layout: issue
---

With sqlite3, when doing a query with a condition that matches a text column with an ASCII-8BIT encoded string, we get inconsistent results:
- when using a dynamic finder, no results are returned
- when using `#where` with hash condition, no results are returned
- when using `#where` with an array condition, expect results are returned

Here is a quick example where path is the text column:

``` ruby
Loading test environment (Rails 4.2.0)
irb(main):001:0> p = "/test/some/path/in/the/repo"
=> "/test/some/path/in/the/repo"
irb(main):002:0> Change.where(:path => p).count
   (0.0ms)  SELECT COUNT(*) FROM "changes" WHERE "changes"."path" = ?  [["path", "/test/some/path/in/the/repo"]]
=> 2
# fine, now we encode the string to ASCII-8BIT
irb(main):003:0> p.encode! "ASCII-8BIT"
=> "/test/some/path/in/the/repo"
irb(main):004:0> Change.where(:path => p).count
   (0.0ms)  SELECT COUNT(*) FROM "changes" WHERE "changes"."path" = ?  [["path", "/test/some/path/in/the/repo"]]
=> 0
irb(main):005:0> Change.where("path = ?", p).count
   (1.0ms)  SELECT COUNT(*) FROM "changes" WHERE (path = '/test/some/path/in/the/repo')
=> 2
irb(main):006:0> Change.find_by_path(p)
  Change Load (0.0ms)  SELECT  "changes".* FROM "changes" WHERE "changes"."path" = ? LIMIT 1  [["path", "/test/some/path/in/the/repo"]]
=> nil
```

