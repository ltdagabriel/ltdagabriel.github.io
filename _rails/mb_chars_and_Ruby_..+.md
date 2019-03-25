---
title: mb_chars and Ruby 1.9.3+
labels: activesupport, docs
layout: issue
---

From [docs](https://github.com/rails/rails/blob/master/activesupport/lib/active_support/core_ext/string/multibyte.rb#L20-21):

> In Ruby 1.9 and newer `mb_chars` returns `self`

It returns an `ActiveSupport::Multibyte::Chars` object for me.

