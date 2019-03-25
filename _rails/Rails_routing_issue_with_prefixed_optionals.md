---
title: Rails 5 routing issue with prefixed optionals
labels: With reproduction steps, actionpack, regression, routing
layout: issue
---

Hi,

I'm experiencing an issue with rails 5.0.0.beta1 also present on the master branch

It's about paths with prefixed optionals, like:

``` rb
get 'prefixed_optional(/p-:page)', to: 'test#prefixed_optional', as: :prefixed_optional
```

Executable test cases:
### Master

https://gist.github.com/tagliala/99239dd2ab599cec5e41#file-test_master-rb

```
# Running:

D, [2016-01-15T14:33:44.437701 #57966] DEBUG -- : 
D, [2016-01-15T14:33:44.437808 #57966] DEBUG -- : 
I, [2016-01-15T14:33:44.438191 #57966]  INFO -- : Started GET "/prefixed_optional/p-12" for 127.0.0.1 at 2016-01-15 14:33:44 +0100
F, [2016-01-15T14:33:44.439684 #57966] FATAL -- : 
ActionController::RoutingError (No route matches [GET] "/prefixed_optional/p-12"):
  test.rb:49:in `test_returns_success'


F

Finished in 0.041807s, 23.9193 runs/s, 23.9193 assertions/s.

  1) Failure:
BugTest#test_returns_success [test.rb:50]:
Failed assertion, no message given.

1 runs, 1 assertions, 1 failures, 0 errors, 0 skips
```
### 4.2.5

https://gist.github.com/tagliala/99239dd2ab599cec5e41#file-test_425-rb

```
# Running:

D, [2016-01-15T14:33:27.352895 #57954] DEBUG -- : 
D, [2016-01-15T14:33:27.352964 #57954] DEBUG -- : 
I, [2016-01-15T14:33:27.353285 #57954]  INFO -- : Started GET "/prefixed_optional/p-12" for 127.0.0.1 at 2016-01-15 14:33:27 +0100
.

Finished in 0.041603s, 24.0369 runs/s, 24.0369 assertions/s.

1 runs, 1 assertions, 0 failures, 0 errors, 0 skips
```

