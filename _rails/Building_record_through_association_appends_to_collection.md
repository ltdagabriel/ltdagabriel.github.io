---
title: Building record through association appends to collection
labels: activerecord
layout: issue
---

Upgrading from 3.0 to 3.2 and run into this issue when building a record through associations.

Rails 3.0

``` ruby
puts @post.comments  => []
form_tag(@post.comments.new) {}
puts @post.comments  => []
```

Rails 3.2

``` ruby
puts @post.comments  => []
form_for(@post.comments.new)
puts @post.comments  => [#<Comment id=nil>]
```

The behaviour of Rails 3.0 was good and worked as expected. The behaviour of Rails 3.2. is unexpected, and I haven't found a nice way of getting around it besides doing:

``` ruby
form_for(Comment.new(:post => @post))
```

