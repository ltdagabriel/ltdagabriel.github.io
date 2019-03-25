---
title: Caller location isn't accurate for `alias_method_chain` deprecation message
labels: With reproduction steps, activesupport, attached PR
layout: issue
---

### Steps to reproduce

``` bash
rails new reproduce-app
# Add `gem 'meta-tags'` to Gemfile
bundle install
rails s
```
### Expected behavior

It should tell the call came from the gem.
### Actual behavior

It tells it came from `core_ext/module/aliasing.rb`
### System configuration

**Rails version**: 2.3.1

**Ruby version**: 5.0.0.beta4
### Possible fix

``` diff
diff --git a/activesupport/lib/active_support/core_ext/module/aliasing.rb b/activesupport/lib/active_support/core_ext/module/aliasing.rb
index b6934b9..772fb29 100644
--- a/activesupport/lib/active_support/core_ext/module/aliasing.rb
+++ b/activesupport/lib/active_support/core_ext/module/aliasing.rb
@@ -24,7 +24,7 @@ class Module
   #
   # so you can safely chain foo, foo?, foo! and/or foo= with the same feature.
   def alias_method_chain(target, feature)
-    ActiveSupport::Deprecation.warn("alias_method_chain is deprecated. Please, use Module#prepend instead. From module, you can access the original method using super.")
+    ActiveSupport::Deprecation.warn("alias_method_chain is deprecated. Please, use Module#prepend instead. From module, you can access the original method using super.", caller_locations(1))

     # Strip out punctuation on predicates, bang or writer methods since
     # e.g. target?_without_feature is not a valid method name.
```

