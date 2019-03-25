---
title: Inflection error in active_support-3.2.12 which don't exist in 4.0.0.beta1
labels: activesupport
layout: issue
---

<code>gem 'activesupport', '3.2.13.rc1'  # 3.2.12 works the same
require 'active_support/core_ext/string/inflections'
'address'.singularize # => 'addres'</code>

<code>gem 'activesupport', '4.0.0.beta1'
require 'active_support/core_ext/string/inflections'
'address'.singularize # => 'address'
</code>

I think, it should be either backported to 3.2 or at least mentioned as change in 4.0.0 (unfortnately I don't know which commit caused such behavior change)

