---
title: Rails 4.2.3 regression on unscoped belongs_to
labels: activerecord, regression
layout: issue
---

When including belongs_to relationships which cleans (unscope) default_scopes into new scopes, the default_scope remains applied.

Following script reproduces a regression introduced in 4.2.3.rc1

> https://gist.github.com/everton/7eed6c00c42712cc0a1f

**Obs.:** The problem occur only if the new scope use the "regular" association name, if the name of association does not reflect the name of the class it works perfeclty, what enable a workaround while this is not fixed:

``` ruby
class Comment
  belongs_to :post, -> { unscope(where: :disabled_at) }
  belongs_to :post_even_if_deleted, -> { unscope(where: :disabled_at) }, 
    class_name: 'Post', foreign_key: :post_id

  scope :sorted_post_title, -> {
    # includes(:post).order('posts.title ASC')
    includes(:post_even_if_deleted).order('posts.title ASC')
  }
end
```

This issue is a response to @rafaelfranca request into #20679

