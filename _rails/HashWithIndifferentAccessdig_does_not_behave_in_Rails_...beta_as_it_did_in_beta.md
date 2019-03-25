---
title: HashWithIndifferentAccess#dig does not behave in Rails 5.0.0.beta2 as it did in beta1
labels: With reproduction steps, activesupport, attached PR, regression
layout: issue
---

Here's the snippet of code to replicate: https://gist.github.com/claudiob/f2096db9d47e35d19ad2

In short, given a hash with indifferent access like

``` ruby
data = {"this" => {"views" => 1234}}.with_indifferent_access
```

Then calling `data.dig(:this, :views)` was correctly returning 1234 under beta1 but returns `nil` under beta2.

Even calling `data.dig(:this)` returns `nil` under beta2.

