---
title: Rails 5.1 Doesn't Respect -b (bind) IP address, breaks Heroku/Puma deployments
labels: attached PR, railties, regression
layout: issue
---

### Steps to reproduce

Deploy Rails 5.1 RC1 app to Heroku.

### Expected behavior

Default behavior used to be to bind to localhost, which works fine. Now appears to want to use HOST as the binding address, which does not work.

### Actual behavior

Example log output from my app. Note that -b option is specified, but ignored. I verified this same configuration works fine in 5.0.1

```
Mar 20 20:20:07 ex-staging app/api:  Release v38 created by user obiefernandez 
Mar 20 20:20:12 ex-staging heroku/web.1:  Starting process with command `bin/rails server -p 31079 -e production -b 0.0.0.0` 
Mar 20 20:20:19 ex-staging app/web.1:  => Booting Puma 
Mar 20 20:20:19 ex-staging app/web.1:  => Rails 5.1.0.rc1 application starting in production on http://staging.example.com:31079 
Mar 20 20:20:19 ex-staging app/web.1:  => Run `rails server -h` for more startup options 
Mar 20 20:20:19 ex-staging app/web.1:  Puma starting in single mode... 
Mar 20 20:20:19 ex-staging app/web.1:  * Version 3.8.2 (ruby 2.3.3-p222), codename: Sassy Salamander 
Mar 20 20:20:19 ex-staging app/web.1:  * Min threads: 5, max threads: 5 
Mar 20 20:20:19 ex-staging app/web.1:  * Environment: production 
Mar 20 20:20:19 ex-staging app/web.1:  * Listening on tcp://staging.example.com:31079 
Mar 20 20:20:19 ex-staging app/web.1:  Exiting 
Mar 20 20:20:19 ex-staging app/web.1:  D, [2017-03-21T03:20:19.331584 #4] DEBUG -- : **Airbrake: {"id"=>"...", "url"=>"https://airbrake.io/locate/00054b35-..."} 
Mar 20 20:20:19 ex-staging app/web.1:  /app/vendor/bundle/ruby/2.3.0/gems/puma-3.8.2/lib/puma/binder.rb:269:in `initialize': Cannot assign requested address - bind(2) for "staging.example.com" port 31079 
```

### System configuration
**Rails version**:
5.1.0.rc1

**Ruby version**:
2.3.3-p222

