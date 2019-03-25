---
title: BasicsTest got 2 failures with Oracle since #6344 reverted
labels: activerecord
layout: issue
---

BasicsTest got 2 failures with Oracle since #6344 reverted.

``` ruby

$ cd activerecord
$ ARCONN=oracle ruby -Itest test/cases/base_test.rb
Using oracle
Run options: --seed 17559

# Running tests:

...........................................................................................................F.F...........................................................................

Finished tests in 7.047839s, 26.2492 tests/s, 58.7414 assertions/s.

  1) Failure:
test_multiparameter_attributes_on_time_will_ignore_hour_if_missing(BasicsTest) [test/cases/base_test.rb:755]:
Expected: 2004-12-12 00:12:02 +0900
  Actual: 2004-12-12 00:12:02 UTC

  2) Failure:
test_multiparameter_attributes_on_time_with_empty_seconds(BasicsTest) [test/cases/base_test.rb:882]:
Expected: 2004-06-24 16:24:00 +0900
  Actual: 2004-06-24 16:24:00 UTC

185 tests, 414 assertions, 2 failures, 0 errors, 0 skips
```
- These failure have been introduced since ceb68d18745ec87e6a894a0c560dd726c84e8c6d
- #6126 was closed as it did not happen. At that timing I did not investigate it, This issue might had been addressed by #6344, then reverted.

