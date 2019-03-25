---
title: Rails.logger log level is not thread safe
labels: activesupport, attached PR
layout: issue
---

We discovered while trying to silence certain of our requests that changing the Rails.logger level is not thread safe. The main issue appears to be that Rails.logger is a singleton. As I started digging through the ActiveSupport::Logger code, I realized that Rails.logger.silence suffers from the same issue we discovered in our codebase.

I have created executable tests displaying the issue here: https://gist.github.com/rdubya/5c3ffb3e49d0c2bd42e9 We discovered the issue in JRuby, but I have gotten the tests in the gist to fail in both JRuby and MRI 2.2.

If you look at the second test case, the worst case scenario is that your log level is permanently changed to whatever level is passed to the call to #silence or ::Logger::ERROR if nothing is passed.

A couple of thoughts that I had for possible solutions:
- Update ActiveSupport::Logger to use thread variables to store the level (could possibly make this an option when the logger is created)
- Create a new class (such as ActiveSupport::ThreadsafeLogger or ActiveSupport::Logger::Threadsafe) which extends ActiveSupport::Logger and uses thread variables to store the level
- Update Rails.logger to optionally maintain separate loggers or log levels for each thread

I'm willing to take a shot at creating a patch for this, but wanted to get an idea of the right direction to head down.

