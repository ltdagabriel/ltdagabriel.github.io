---
title: Destroying already destroyed object with touch association causes "can not touch on a new record object" error
labels: activerecord, attached PR
layout: issue
---

The following test fails: https://gist.github.com/ronalchn/8078852

Trying to destroy an object which was already automatically destroyed by its parent causes the error.

``` ruby
class Post < ActiveRecord::Base
  has_many :comments, dependent: :destroy, inverse_of: :post # setting inverse does not change behaviour of tests
end

class Comment < ActiveRecord::Base
  belongs_to :post, touch: true, inverse_of: :comments
end

class BugTest < Minitest::Unit::TestCase
  def test_association_failing
    comment = Comment.create(post: Post.new)
    comment.post.destroy
    comment.destroy #=> ActiveRecord::ActiveRecordError: can not touch on a new record object
  end
  def test_comment_destroyed
    comment = Comment.create(post: Post.new)
    comment.post.destroy
    refute comment.persisted?, 'destroying post should destroy comment' #=> true
  end
end
```

Normally, destroying an already destroyed object doesn't throw any errors, so this race condition should also not throw an error.

Note that `comment` remains persisted even after its parent is destroyed. Actually, it is not a big problem if it things it still is persisted (which would be the case without the `inverse_of` option), but it shouldn't cause the touch error.

Also note the inconsistent behaviour that occurs when `comment` is reloaded before destroying the post.

Relevant issues are: https://github.com/rails/rails/pull/9320 and https://github.com/rails/rails/pull/9443

---

Workaround:

``` ruby
comment.clear_association_cache
comment.destroy #=> doesn't throw error anymore
```

