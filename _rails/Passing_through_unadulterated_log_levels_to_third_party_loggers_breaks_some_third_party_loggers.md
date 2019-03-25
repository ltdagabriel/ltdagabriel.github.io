---
title: Passing through unadulterated log levels to third party loggers breaks some third party loggers
labels: regression
layout: issue
---

Since https://github.com/rails/rails/commit/e0a521cfcd13e4d1f0ae8ab96004289e1c020f71, `config.log_level` is passed through to `Rails.logger.level` without converting to a numeric value unless it's using the stdlib `Logger`.

This fixed some third party loggers, but broke others that do quack like the stdlib `Logger`, most specifically https://github.com/sparklemotion/sysloglogger, causing an error like:

``` ruby
comparison of Symbol with 1 failed
sysloglogger-dacf8ef846d7/lib/syslog/logger.rb:189:in `<='
sysloglogger-dacf8ef846d7/lib/syslog/logger.rb:189:in `add'
sysloglogger-dacf8ef846d7/lib/syslog/logger.rb:102:in `info'
```

sysloglogger is easily patched ala https://github.com/noahhl/sysloglogger/commit/b29bf08a6216364524a866a44ac5254975766880,  so perhaps the fix should be there (though I'd argue it's trying to be a good citizen and act like the stdlib logger), but there's definitely a change in behavior here that impacts some loggers.

cc/ @dhh

