---
title: Puma startup message breaks the test results
labels: actionpack, attached PR
layout: issue
---

This is probably for @eileencodes. As the title says, it looks like Puma is started when the first system test is ran, which can happen after other tests ran. When it is the case, the Puma startup message is outputted in the middle of the test results.

FYI it looks like `capybara-rails` suppresses the Puma startup message, hence avoiding this issue.

### Steps to reproduce

Add system tests to your application, run `rails test`

### Expected behavior
Tests output is a continuous line of dots : 
```
$ rails test
# Running tests with run options --seed 58345:
..................
Finished tests in 3.501496s, 5.1407 tests/s, 10.2813 assertions/s.
18 tests, 36 assertions, 0 failures, 0 errors, 0 skips
```

### Actual behavior
The puma starting message appears in the middle of all of those nice dots
```
$ rails test
# Running tests with run options --seed 58345:
.............Puma starting in single mode...
* Version 3.7.1 (ruby 2.3.3-p222), codename: Snowy Sagebrush
* Min threads: 0, max threads: 1
* Environment: test
* Listening on tcp://0.0.0.0:53594
Use Ctrl-C to stop
.....
Finished tests in 3.501496s, 5.1407 tests/s, 10.2813 assertions/s.
18 tests, 36 assertions, 0 failures, 0 errors, 0 skips
```

### System configuration
**Rails version**:
5.1.0 from master

**Ruby version**:
2.3.3p222
