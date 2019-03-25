---
title: association building inconsistency for polymorphic associations
labels: activerecord
layout: issue
---

There is an inconsistency in ActiveRecord 3.2.8 polymorphic association behaviour that might also have security implications in some special circumstances. Consequent use of `attr_accessible` in models will avoid these security problems.

Imagine a minimal configuration like this:

```
class Article < ActiveRecord::Base
  has_many :comments
end

class Comment < ActiveRecord::Base
  belongs_to :article
end
```

When building an association:

```
article = Article.find 1234
article.comments.build
# => <Comment id:nil, ..., article_id: 1234>
```

the article_id is set correctly because of the associations. ActiveRecord even prevents manipulation of article_id:

```
article.comments.build :article_id => 56
# results in <Comment id:nil, ..., article_id: 1234>
```

This is very useful because you can build such an association from user-given params[] without validating, filtering or protecting article_id from mass assignment.

However, this behaviour is not the same for polymorphic assocations:

```
class Article < ActiveRecord::Base
  has_many :comments, :as => :commentable
end

class Comment < ActiveRecord::Base
  belongs_to :commentable, :polymorphic => true
end

article = Article.find 1234
article.comments.build
# => <Comment id:nil, ..., commentable_type: "Article", commentable_id: 1234>

article.comments.build :commentable_id => 56
# => <Comment id:nil, ..., commentable_type: "Article", commentable_id: 1234>

article.comments.build :commentable_id => 56, :commentable_type => 'other'
# => <Comment id:nil, ..., commentable_type: "other", commentable_id: 1234>
```

Please note the last line where the commentable_type has been manipulated by the given parameters. This means that
- assuming developers trust that article.comments.build(params) always
  associates the comment to article regardless of the given params
- users can insert a hidden commentable_type field and fill it with malicious
  data
- which MIGHT cause security problems in some special circumstances (just think
  of an online-banking system where a transaction is not associated to
  `<transaction_type: "OutgoingPayment", transaction_id: 1234>` but to
  `<transaction_type: "IncomingPayment", transaction_id: 1234>` where the
  IncomingPayment #1234 is something completely other, assigned to another
  user etc.)

