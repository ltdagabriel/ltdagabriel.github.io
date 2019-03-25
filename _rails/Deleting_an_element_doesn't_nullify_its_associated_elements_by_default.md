---
title: Deleting an element doesn't nullify its associated elements by default
labels: activerecord
layout: issue
---

As specified on [Api's website](http://api.rubyonrails.org/classes/ActiveRecord/Associations/ClassMethods.html), when we have a `has_many` without a dependent option set we should have had its associated elements nullified by default when we delete an element. 

But, as I tried on [this gist](https://gist.github.com/2372462), it is doing nothing with the associated element and thus we remain with an invalid id on the associated table. I tried it on a Rails 3.2.x app console. 

Is it expected? 

