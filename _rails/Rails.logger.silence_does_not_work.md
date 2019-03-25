---
title: Rails.logger.silence does not work
labels: attached PR, railties
layout: issue
---

I've tested on rails 5.0.0.beta2 and the master branch. In both, I see this behavior from a rails console:

```
$ rails console
Running via Spring preloader in process 19351
Loading development environment (Rails 5.0.0.beta2)
2.2.3 :001 > Rails.logger.info Rails.version; Rails.logger.silence { Rails.logger.info "quiet" }
5.0.0.beta2
quiet
 => true
```

Notice that "quiet" was logged in the output, even though it should have been silenced.

The same thing running in rails 4.2:

```
rails c
Loading development environment (Rails 4.2.5.1)
2.2.3 :001 > Rails.logger.info Rails.version; Rails.logger.silence { Rails.logger.info "quiet" }
4.2.5.1
 => true
```

Here, the "quiet" was silenced, as expected.

It looks like there was a lot of work attempting to make it threadsafe. Could be related to https://github.com/rails/rails/pull/20507/

