---
title: Freezing a cloned ActiveRecord object freezes the original too
labels: activerecord
layout: issue
---

Steps to reproduce:

```
$ rails new testcase
$ cd testcase
$ rails g model SomeARModel
$ rake db:migrate
$ rails console
> a = SomeArModel.new
> b = a.clone
> b.freeze
> a.frozen? # => true, should be false
```

Other ruby objects don't exhibit this behavior.

