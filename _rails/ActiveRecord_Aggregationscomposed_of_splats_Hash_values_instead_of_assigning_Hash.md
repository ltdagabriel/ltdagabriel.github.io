---
title: ActiveRecord::Aggregations#composed_of splats Hash values instead of assigning Hash
labels: With reproduction steps, activerecord
layout: issue
---

### Steps to reproduce
- define `composed_of` on a model with a `preferences` text column with a mapping set to a method that returns a Hash instance.
- point the `class_name` argument to a class (e.g. `User::Preference`) whose initializer expects a single argument
- assign `model.preferences = { thing: false, stuff: true } 
- ArgumentError 2 for 1

See the repro app here: https://github.com/olivierlacan/rails-4-2-composed-of-hash-values-splat
- clone
- bundle
- rake test
- open https://github.com/olivierlacan/rails-4-2-composed-of-hash-values-splat/blob/master/test/models/user_test.rb#L8-L10

This "bug" (debatable) was introduced by: https://github.com/rails/rails/commit/36e9be8524ff524ac5ea51dd1fc6ee33cfe4285a

It wasn't resolved by https://github.com/rails/rails/commit/0d5d8594b1a7d7caab0cbc9fe3340bb5bfbe79bd which resolved a different issue caused by the above commit.

I promise I really like @sgrif, it's just very surprising behavior and I don't think `composed_of` should do that. Furthermore, there was no deprecation policy announcing this breaking change.
### Expected behavior

I would expect composed_of's dynamic writer to assign my damn Hash instance to my damn text column. :smile:
### Actual behavior

ArgumentError because composed_of's `writer_method` is splatting the `Hash#values` and sending them to `klass.new` (in my example `User::Preferences.new`) instead of sending the full Hash.
### System configuration

**Rails version**: 4.2.7

**Ruby version**: 2.3.1

