---
title: helper :all from ActionMailer
labels: actionmailer
layout: issue
---

The documentation for `AbstractController::Helpers#helper` states that `:all` is a special parameter.

Indeed, from a `ActionController::Base`, `helper :all` will use all the helper files. It even does that by default in Rails 3 / 3.1rc1.

On the other hand, this doesn't work from `ActionMailer::Base` and we get:

```
Missing helper file helpers/all_helper.rb
```

Note that `ActionMailer::Base < AbstractController::Helpers` is true.

1) It would be nice if `helper :all` could work for `ActionMailer::Base` also.

2) If it did, maybe `ActionMailer::Base` should call it by default, as `ActionController` does

3) If it wont, and `:all` can not handled by all descendants of `AbstractController::Helpers`, then the doc should be updated to reflect this.

Comments to be found in the [imported issue](https://github.com/rails/rails/issues/928)

