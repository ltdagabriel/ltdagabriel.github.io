---
title: Creating an object using an array of arrays for #{relationship}_ids associates the relationship with id => 1 if any, instead of raising an exception.
labels: activerecord
layout: issue
---

If I have these classes:

``` ruby
class Post < ActiveRecord::Base
  has_many :comments
end

class Comment < ActiveRecord::Base
  belongs_to :post
end
```

Then I see this behavior:

```
ree-1.8.7-2011.03 :001 > Comment.create!
 => #<Comment id: 1, post_id: nil, created_at: "2011-12-16 01:34:10", updated_at: "2011-12-16 01:34:10">

ree-1.8.7-2011.03 :001 > Comment.create!
 => #<Comment id: 2, post_id: nil, created_at: "2011-12-16 01:34:49", updated_at: "2011-12-16 01:34:49"> 

ree-1.8.7-2011.03 :005 > comments = Comment.where(:id => 2)
 => [#<Comment id: 2, post_id: nil, created_at: "2011-12-16 01:34:49", updated_at: "2011-12-16 01:34:49">]

ree-1.8.7-2011.03 :003 > Post.new(:comment_ids => [ comments.map(&:id) ]).comments
 => [#<Comment id: 1, post_id: nil, created_at: "2011-12-16 01:34:10", updated_at: "2011-12-16 01:34:10">]
```

In the last line there is a bug where I'm wrapping something that is already an array, which is not valid, but rather than raising an error I get back the comment with id = 1, which is clearly not what I wanted.

I tracked this down to https://github.com/rails/rails/master/activerecord/lib/active_record/connection_adapters/column.rb#L78 where anything that does not respond to to_i is type cast to the value of 1.

Is the `ActiveRecord::ConnectionAdapters::Column#type_cast` code correct? It seems like it should raise an exception if given something that can't be converted to an integer trivially. The `rescue value ? 1 : 0` portion appears to be there so that booleans are coerced properly, but it doesn't make much sense for anything else.

I'll work on a pull request for this if someone can give me guidance on whether it should be fixed in Column#type_cast or somewhere upstream.

