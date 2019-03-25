---
title: Please fix select_tag in 3.2.8
labels: actionview, regression
layout: issue
---

Hi!

In 3.2.7 this code was possible if 'auto_models_for_select' is nil :
<%= select_tag :model, auto_models_for_select, :include_blank => true,
:disabled => auto_models_for_select.nil? %>

In 3.2.8 this should be :
<%= select_tag :model, auto_models_for_select || '', :include_blank =>
true, :disabled => auto_models_for_select.nil? %>

If second parameter is nil it raise an exception.

Please, return back that it was possible to transfer nil of second
parameter - options.

