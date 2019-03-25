---
title: Ruby 2.4 #to_time incompatibility
labels: activesupport, attached PR, regression
layout: issue
---

Ruby 2.4 changes `Time#to_time` and `DateTime#to_time` to preserve timezone. This is a good thing, but it breaks Active Support's scheme to harmonize `#to_time` behavior.

Example build failures:
- https://github.com/rails/rails/blob/master/activesupport/test/core_ext/date_time_ext_test.rb#L55
- https://github.com/rails/rails/blob/master/activesupport/test/core_ext/time_with_zone_test.rb#L423
- https://travis-ci.org/rails/rails/jobs/124101215#L533-L542

Ruby changes:
- DateTime: https://bugs.ruby-lang.org/issues/12189
- Time: https://bugs.ruby-lang.org/issues/12271

We'll need to update our `#to_time` to feature-detect the new versions and behave consistently on Ruby 2.3.0 and 2.4.0.

