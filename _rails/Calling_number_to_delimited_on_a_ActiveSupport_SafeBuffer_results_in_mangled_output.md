---
title: Calling number_to_delimited on a ActiveSupport::SafeBuffer results in mangled output
labels: activesupport
layout: issue
---

A change made in #10996 broke `number_to_delimited` when operating on `ActiveSupport::SafeBuffer` as the `gsub!` call was changed from a back-reference style to a block-style using `$1` which cannot be used with `ActiveSupport::SafeBuffer` (see #1555).

I believe that changing the `ActiveSupport::NumberHelper::NumberToDelimitedConverter` class to return to using a back-reference style should fix the problem:

i.e. change `left.gsub!(DELIMITED_REGEX) { "#{$1}#{options[:delimiter]}" }` back to `left.gsub!(DELIMITED_REGEX, "\\1#{options[:delimiter]}")`

Let me know if you want me to work up an MR for this.

