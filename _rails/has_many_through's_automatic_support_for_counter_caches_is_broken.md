---
title: has_many :through's automatic support for counter_caches is broken
labels: activerecord
layout: issue
---

See the code in this gist: https://gist.github.com/1446430

Basically, there seems to be some baked in `counter_cache` detection + support in AR that is implemented on the `has_many :through` relation, which seems to be the wrong place to do it (there is a reason why the `:counter_cache` option is set on the `belongs_to` after all).

Output of the above gist:

```
Active Record 3.1.3
-- create_table(:users, {:force=>true})
   -> 0.0417s
-- create_table(:projects, {:force=>true})
   -> 0.0005s
-- create_table(:memberships, {:force=>true})
   -> 0.0004s
Initially:
User's projects_count is 0
Projects's users_count is 0
After adding the project once:
User's projects_count is 1
Projects's users_count is 0
After adding the project a second time:
User's projects_count is 2
Projects's users_count is 0
```

I would expect to see the `project`'s `users_count` to go to `1`, and the `user`'s `project_count` to remain at one. 

I wasn't able to run this against rails edge following the instructions from here: http://jonathanleighton.com/articles/2011/awesome-active-record-bug-reports/

PS Setting the `:counter_cache` option on the `Membership` works correctly, however it then doubles up with the problem shown here. So the counter goes up and down by two.

For the moment I am working around this by renaming my counter so it isn't automatically picked up. Are there any better suggestions?

Thanks,
Tom

