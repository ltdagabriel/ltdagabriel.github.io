---
title: class_serial increment at each request
labels: activesupport, attached PR
layout: issue
---

### Steps to reproduce

Clone https://github.com/etiennebarrie/class_serial or:

```
$ rails _5.0.0.rc1_ new class_serial
$ cd class_serial/
$ rails generate controller ruby_vm stat
```

``` patch
diff --git a/app/controllers/ruby_vm_controller.rb b/app/controllers/ruby_vm_controller.rb
index 422b18b..6b438d0 100644
--- a/app/controllers/ruby_vm_controller.rb
+++ b/app/controllers/ruby_vm_controller.rb
@@ -1,4 +1,5 @@
 class RubyVmController < ApplicationController
   def stat
+    render json: RubyVM.stat
   end
 end
```

Then run the server, access `http://localhost:3000/ruby_vm/stat` and see `class_serial` being incremented at each request, e.g.:

```
$ curl --silent localhost:3000/ruby_vm/stat | jq .class_serial
150790
$ curl --silent localhost:3000/ruby_vm/stat | jq .class_serial
150791
$ curl --silent localhost:3000/ruby_vm/stat | jq .class_serial
150792
```

In development, you have to warm the cache with one request first. Between the first and second requests, `class_serial` increments by more than 1, but then it also increments by one for each request.
### Expected behavior

class_serial should not change between requests
### Actual behavior

class_serial is incremented at each request
### System configuration

**Rails version**:
5.0.0.rc1

**Ruby version**:
2.3.1
### Debugging

It was fine until beta3, and you start seeing this behaviour starting with beta4. I think 291a098c111ff419506094e14c0186389b0020ca is what caused it to happen.

Using @tenderlove's patch to add the `class_serial_incr` event to TracePoint (https://github.com/tenderlove/ruby/tree/IC_trace), I was able to pinpoint the class serial increment to using `instance_exec` in [ActiveSupport::Callbacks::Callback#make_lambda](https://github.com/rails/rails/blob/v5.0.0.rc1/activesupport/lib/active_support/callbacks.rb#L396), and using some puts debugging I found that it came from defining callbacks with a block.

There are three blocks that are called in this case:
-  `to_complete` in [ActiveRecord::QueryCache.install_executor_hooks](https://github.com/rails/rails/blob/v5.0.0.rc1/activerecord/lib/active_record/query_cache.rb#L46)
- `to_run` and `to_complete` in [ActiveSupport::ExecutionWrapper.register_hook](https://github.com/rails/rails/blob/v5.0.0.rc1/activesupport/lib/active_support/execution_wrapper.rb#L38-L45) also called from `QueryCache`.

Removing the first call to instance_exec by passing `self` and defining the `before` method was not enough to remove the issue:

``` patch
diff --git a/activerecord/lib/active_record/query_cache.rb b/activerecord/lib/active_record/query_cache.rb
index ca12a60..e6feb97 100644
--- a/activerecord/lib/active_record/query_cache.rb
+++ b/activerecord/lib/active_record/query_cache.rb
@@ -43,10 +43,12 @@ def self.complete(state)
     def self.install_executor_hooks(executor = ActiveSupport::Executor)
       executor.register_hook(self)

-      executor.to_complete do
-        unless ActiveRecord::Base.connection.transaction_open?
-          ActiveRecord::Base.clear_active_connections!
-        end
+      executor.to_complete(self)
+    end
+
+    def self.before(_executor)
+      unless ActiveRecord::Base.connection.transaction_open?
+        ActiveRecord::Base.clear_active_connections!
       end
     end
   end
```

By displaying something inside the TracePoint, having a `byebug` inside the lambda at `ActiveSupport::Callbacks::Callback#make_lambda`, I think I'm pretty sure now only the `to_run` is causing the class serial increment.

cc @matthewd 

Edit: forgot I also built an example app: https://github.com/etiennebarrie/class_serial

