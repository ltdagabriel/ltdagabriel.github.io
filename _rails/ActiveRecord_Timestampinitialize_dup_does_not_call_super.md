---
title: ActiveRecord::Timestamp#initialize_dup does not call super
labels: activerecord
layout: issue
---

ActiveRecord::Timestamp#initialize_dup does not call super. This results in initialize_copy not being called because the call does not bubble up to Object.

This means that a user who wants special behavior when duping and ActiveRecord::Base object has to override initialize_dup and make sure to call super before doing anything.

If ActiveRecord::Timestamp called super then the common initialize_copy would be called.

Having gone through this and seeing what happens when you clone an ActiveRecord::Base object I'm not sure if this is a bug or a feature.

If it's a bug - the fix is trivial - but I think it deserves some discussion [I did some testing which is documented here: http://wp.me/p2Ddsm-11 ]

