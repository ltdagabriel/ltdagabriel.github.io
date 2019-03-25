---
title: button_to options are lost on GET request
labels: actionview
layout: issue
---

If the `button_to` helper is used with `:method => :get`, the options parameters are appended to the action string and removed by the browser on submission.

Apparently it is a known behavior, how browsers treat forms submitted via GET.  This does not happen if the method in POST. 

It seems that when submitting via GET with `button_to`, the only way to pass options is to use hidden fields.

