---
title: Url Helpers in integration tests don't respect RAILS_RELATIVE_URL_ROOT
labels: actionpack
layout: issue
---

When running integration tests like this:

```
$ RAILS_RELATIVE_URL_ROOT='/myapp' rspec spec/requests
```

URL helpers used in tests to navigate or confirm correct urls ignore RAILS_RELATIVE_URL_ROOT. I discussed this at #5122 [here](https://github.com/rails/rails/issues/5122#issuecomment-10536050) and [here](https://github.com/rails/rails/issues/5122#issuecomment-11223475). This testing issue is a subset of the other issues raised there. I will be submitting a tested pull request for this issue.

