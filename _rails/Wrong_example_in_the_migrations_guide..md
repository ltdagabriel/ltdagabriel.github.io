---
title: Wrong example in the migrations guide.
labels: docs
layout: issue
---

[The example used in the migrations guide to illustrate gotchas that happen when using models in migrations](http://guides.rubyonrails.org/migrations.html#using-models-in-your-migrations) is wrong. Supposedly the problem depends on conflicting validations, but the migrations use `update_all` which does not run them.

This needs to be revised altogether. We cannot just rewrite the call as a loop because you wouldn't do that in a real migration. The example cannot be artificial, we have to show real world code.

