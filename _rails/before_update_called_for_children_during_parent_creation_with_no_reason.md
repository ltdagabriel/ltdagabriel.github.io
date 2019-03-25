---
title: before_update called for children during parent creation with no reason
labels: With reproduction steps, activerecord, attached PR
layout: issue
---

### Steps to reproduce

I attach two files which are identical except one uses Rails 5.0 and one Rails 4.2.

The Rails 5.0 version fails since the before_update callback is called for the `User` while in Rails 4.2 is not.

Is not clear to me why this is happening and I could solve it setting `has_many :users, through: :followers, autosave: false` in the `Article` model.

I think this is not documented in Rails migration from 4.2 to 5.0  or at least not clear enough.

From my point of view can even be considered a bug.

Activerecord5: https://gist.github.com/coorasse/cf58fbb17535f440b6b86ae5175cdacf
Activerecord4: https://gist.github.com/coorasse/edba0c40e1a5b060c7bb3754be2e7bfa

