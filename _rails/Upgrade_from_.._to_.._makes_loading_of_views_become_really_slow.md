---
title: Upgrade from 3.2.12 to 3.2.13 makes loading of views become really slow
labels: actionview, asset pipeline, regression
layout: issue
---

This morning, I updated rails from 3.2.12 to 3.2.13, which resulted in a major delay in loading my views. This is from loading my home page:

```
Rails 3.2.12:
Completed 200 OK in 387ms (Views: 339.0ms | ActiveRecord: 27.1ms)

Rails 3.2.13:
Completed 200 OK in 4416ms (Views: 4361.2ms | ActiveRecord: 28.7ms)
```

The only difference between the two commits it the Rails version, which of course did also result in a lot of other gems being updated... This is the difference in the Gemfile.lock:

```
GEM
   remote: https://rubygems.org/
   specs:
-    actionmailer (3.2.12)
-      actionpack (= 3.2.12)
-      mail (~> 2.4.4)
-    actionpack (3.2.12)
-      activemodel (= 3.2.12)
-      activesupport (= 3.2.12)
+    actionmailer (3.2.13)
+      actionpack (= 3.2.13)
+      mail (~> 2.5.3)
+    actionpack (3.2.13)
+      activemodel (= 3.2.13)
+      activesupport (= 3.2.13)
       builder (~> 3.0.0)
       erubis (~> 2.7.0)
       journey (~> 1.0.4)
@@ -14,19 +14,19 @@ GEM
       rack-cache (~> 1.2)
       rack-test (~> 0.6.1)
       sprockets (~> 2.2.1)
-    activemodel (3.2.12)
-      activesupport (= 3.2.12)
+    activemodel (3.2.13)
+      activesupport (= 3.2.13)
       builder (~> 3.0.0)
-    activerecord (3.2.12)
-      activemodel (= 3.2.12)
-      activesupport (= 3.2.12)
+    activerecord (3.2.13)
+      activemodel (= 3.2.13)
+      activesupport (= 3.2.13)
       arel (~> 3.0.2)
       tzinfo (~> 0.3.29)
-    activeresource (3.2.12)
-      activemodel (= 3.2.12)
-      activesupport (= 3.2.12)
-    activesupport (3.2.12)
-      i18n (~> 0.6)
+    activeresource (3.2.13)
+      activemodel (= 3.2.13)
+      activesupport (= 3.2.13)
+    activesupport (3.2.13)
+      i18n (= 0.6.1)
       multi_json (~> 1.0)
     airbrake (3.1.7)
       activesupport
@@ -129,7 +129,7 @@ GEM
     hashr (0.0.22)
     hike (1.2.1)
     honeypot-captcha (0.0.2)
-    i18n (0.6.4)
+    i18n (0.6.1)
     journey (1.0.4)
     jquery-rails (2.2.0)
       railties (>= 3.0, < 5.0)
@@ -146,7 +146,7 @@ GEM
     kgio (2.8.0)
     listen (0.7.2)
     lumberjack (1.0.2)
-    mail (2.4.4)
+    mail (2.5.3)
       i18n (>= 0.4.0)
       mime-types (~> 1.16)
       treetop (~> 1.4.8)
@@ -155,7 +155,7 @@ GEM
     mime-types (1.21)
     mocha (0.10.5)
       metaclass (~> 0.0.1)
-    multi_json (1.6.1)
+    multi_json (1.7.1)
     mysql2 (0.3.11)
     nested_form (0.3.1)
     net-scp (1.0.4)
@@ -180,14 +180,14 @@ GEM
       rack
     rack-test (0.6.2)
       rack (>= 1.0)
-    rails (3.2.12)
-      actionmailer (= 3.2.12)
-      actionpack (= 3.2.12)
-      activerecord (= 3.2.12)
-      activeresource (= 3.2.12)
-      activesupport (= 3.2.12)
+    rails (3.2.13)
+      actionmailer (= 3.2.13)
+      actionpack (= 3.2.13)
+      activerecord (= 3.2.13)
+      activeresource (= 3.2.13)
+      activesupport (= 3.2.13)
       bundler (~> 1.0)
-      railties (= 3.2.12)
+      railties (= 3.2.13)
     rails_admin (0.4.3)
       bootstrap-sass (~> 2.2)
       builder (~> 3.0)
@@ -202,9 +202,9 @@ GEM
       rails (~> 3.1)
       remotipart (~> 1.0)
       sass-rails (~> 3.1)
-    railties (3.2.12)
-      actionpack (= 3.2.12)
-      activesupport (= 3.2.12)
+    railties (3.2.13)
+      actionpack (= 3.2.13)
+      activesupport (= 3.2.13)
       rack-ssl (~> 1.3.2)
       rake (>= 0.8.7)
       rdoc (~> 3.4)
@@ -212,7 +212,7 @@ GEM
     raindrops (0.10.0)
     rake (10.0.3)
     rb-fsevent (0.9.1)
-    rdoc (3.12.1)
+    rdoc (3.12.2)
       json (~> 1.4)
     remotipart (1.0.2)
     rest-client (1.6.7)
@@ -266,7 +266,7 @@ GEM
       eventmachine (>= 0.12.6)
       rack (>= 1.0.0)
     thor (0.17.0)
-    tilt (1.3.4)
+    tilt (1.3.6)
     tire (0.5.4)
       activemodel (>= 3.0)
       hashr (~> 0.0.19)
@@ -280,7 +280,7 @@ GEM
       actionpack (>= 3.1)
       execjs
       railties (>= 3.1)
-    tzinfo (0.3.35)
+    tzinfo (0.3.37)
     uglifier (1.3.0)
       execjs (>= 0.3.0)
       multi_json (~> 1.0, >= 1.0.2)
@@ -325,7 +325,7 @@ DEPENDENCIES
   nested_form
   newrelic_rpm (~> 3.5.5.38)
   pry
-  rails (= 3.2.12)
+  rails (= 3.2.13)
   rails_admin
   rb-fsevent (= 0.9.1)
   rmagick
```

Other then these two files nothing has changed.

I understand that stuff in the asset pipeline can be slowing it down, but I dont see a difference when I change the value of "config.assets.debug = false" inside of development.rb.

I suppose I do have a lot of assets in my asset pipeline I still need to clean up, which I will do before I deploy to production, but I wonder why this has now suddenly caused the lag after updating Rails. Question is: What is causing it and can I do something about it?

I am running ruby 1.9.3p194 (2012-04-20 revision 35410) [x86_64-darwin11.4.0] and tried both Thin and Puma, but both have the same issue.

