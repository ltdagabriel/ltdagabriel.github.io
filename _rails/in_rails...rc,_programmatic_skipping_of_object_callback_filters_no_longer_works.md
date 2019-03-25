---
title: in rails4.0.0.rc1, programmatic skipping of object callback filters no longer works
labels: activesupport, regression
layout: issue
---

In this gist: https://gist.github.com/seanwalbran/5534126
we're programmatically iterating over all of the validation callbacks 
(via the methods documented here: http://edgeapi.rubyonrails.org/classes/ActiveRecord/Callbacks.html#label-Debugging+callbacks ) 
and calling .skip_callback with the #kind and #filter values returned by each iteration object.

This no longer works as of rails 4.0.0.rc1, apparently related to this commit: https://github.com/rails/rails/commit/8e1d3cd4909c83bbceb7df00da71ec1393a90f6e

It looks like the root issue is that the filter value in the loop above is returned as a string ("_callback_before_TitlePopulator_1"), which, when passed in to skip_callback, results in a comparison with the string "_callback_before_String" (which is the return value of _method_name_for_object_filter when passed in the already-stringified representation of the object filter value).  

A patch like the following may be sufficient to fix the issue:

``` diff
diff --git a/activesupport/lib/active_support/callbacks.rb b/activesupport/lib/active_support/callbacks.rb
index 893c250..1dcacf0 100644
--- a/activesupport/lib/active_support/callbacks.rb
+++ b/activesupport/lib/active_support/callbacks.rb
@@ -133,7 +133,7 @@ module ActiveSupport
       end

       def matches?(_kind, _filter)
-        if @_is_object_filter
+        if @_is_object_filter && !_filter.is_a?(String)
           _filter_matches = @filter.to_s.start_with?(_method_name_for_object_filter(_kind, _filter, false))
         else
           _filter_matches = (@filter == _filter)
```

