---
title: Could not log sql.active_record event errors...
labels: activerecord
layout: issue
---

I had to update one of my apps to head to get some of the actioncable fixes and I am seeing a ton of errors in the log file that seem to be related to f814585bb269f1dd2c275d6ae95d94d8e91d8061,  I am not doing anything weird with logging or my pg connections.  Has the interface changed here?  Any ideas how I would go about trying to diagnose why these errors are getting tossed?  It looks like it happens any time I have missed a Russian doll cache or cached model and it rebuilds as far as I can tell.   Using pg and memcached with the rails memcached cache store. 
### Expected behavior

Normal rails logging of events
### Actual behavior

Tons of errors `Could not log "sql.active_record" event. TypeError: wrong argument type NilClass (must respond to :each) ["/home/deploy/.rvm/gems/ruby-2.3.1/bundler/gems/rails-8e76f6959efc/activerecord/lib/active_record/log_subscriber.rb:42:in `zip'",`
### System configuration

**Rails version**:
Head  (edited to add 6aa378400218404f1002177f5457e296079ae255 to be specific)

**Ruby version**:
2.3.1

