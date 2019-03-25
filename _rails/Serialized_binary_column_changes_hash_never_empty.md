---
title: Serialized binary column changes hash never empty
labels: activerecord, regression
layout: issue
---

I think this is a regression of the changes from #15674. After loading a record with a serialized binary column, the changes hash is always filled:

``` ruby
ActiveRecord::Schema.define do
  create_table :posts do |t|
    t.binary :data
  end
end
class Post < ActiveRecord::Base
  serialize :data
end
Post.create! data: 'foo'
post = Post.first
post.changes
=> {"data"=>["foo", "foo"]}
```

To reproduce use [this testcase gist](https://gist.github.com/46ec569c67626e0f00f4).

