---
title: skip_before_filter strange behavior when using if and only together
labels: actionpack
layout: issue
---

I'm running into an issue when using skip_before_filter with both the "if" and "only" options.

``` ruby
before_filter :test
skip_before_filter :test, only: [:show], if: -> { false }
```

When running the above, I expect "test" to be called when hitting the show action, but this isn't the case.

``` ruby
before_filter :test
skip_before_filter :test, only: [:random], if: -> { false }
```

When running the above, I expect "test" to be called regardless of the conditional when hitting the show action, but this isn't the case. It is called in this case when the conditional evaluates to false but it is not called if the conditional evaluates to true.

