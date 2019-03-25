---
title: has_many :through relationship does not properly handle counter_cache
labels: activerecord
layout: issue
---

The counter_cache does not work properly in a many-to-many relationship. It properly increases the counter when a new object is added, but does not decrease it when the object is deleted again. 

Steps to reproduce:

```
rails g scaffold post title:string body:text
rails g scaffold tag name:string taggings_count:integer
rails g model tagging post_id:integer tag_id:integer
```

Then I created the relationship as shown in my Gist: https://gist.github.com/3710093
The idea is to have an input field when creating a post, where tags can be entered seperated by comma. The tag_names method then splits those tags, adds new ones and deletes the ones that are now missing. (Yes, the method is adding same tags again, but that's not relevant to this issue)

The counter_cache is correctly increased when adding a tag to the list. However, decreasing the number after a tag removal does not work. 

I have done some searching and found several blog articles (e.g. http://whilefalse.net/2011/04/05/rails-3-counter-cache-has_many-through/) explaining that this was a bug in Rails 3.0.x that has been addressed in edge rails. See the old bug report on lighthouse: https://rails.lighthouseapp.com/projects/8994/tickets/2824-patch-has_many-through-doesnt-update-counter_cache-on-join-model-correctly and then the fix on Github: https://github.com/rails/rails/commit/52f09eac5b3d297021ef726e04ec19f6011cb302

Why am I still having this problem, when it was fixed two years ago? Am I missing something here?

``` Console
# rails -v
Rails 3.2.8
```

