---
title: Encoding::CompatibilityError when utf8 project dir and utf8 url
labels: actionpack
layout: issue
---

I name the rails project dir with non-ASCII chars.
It works with any ascii URL.
When URL contains non-ASCII chars,
throw this following CompatibilityError.
It appears both utf8 rails dir name and utf8 url.

<code>[2013-12-28 22:25:07] ERROR Encoding::CompatibilityError: incompatible character encodings: UTF-8 and ASCII-8BIT
    /usr/local/lib/ruby/gems/2.1.0/gems/actionpack-4.0.0/lib/action_dispatch/middleware/static.rb:17:in `join'
    /usr/local/lib/ruby/gems/2.1.0/gems/actionpack-4.0.0/lib/action_dispatch/middleware/static.rb:17:in`match?'
    /usr/local/lib/ruby/gems/2.1.0/gems/actionpack-4.0.0/lib/action_dispatch/middleware/static.rb:59:in `call'
    /usr/local/lib/ruby/gems/2.1.0/gems/railties-4.0.0/lib/rails/engine.rb:512:in`call'
    /usr/local/lib/ruby/gems/2.1.0/gems/railties-4.0.0/lib/rails/application.rb:98:in `call'
    /usr/local/lib/ruby/gems/2.1.0/gems/rack-1.5.2/lib/rack/lock.rb:18:in`call'
    /usr/local/lib/ruby/gems/2.1.0/gems/rack-1.5.2/lib/rack/content_length.rb:15:in `call'
    /usr/local/lib/ruby/gems/2.1.0/gems/rack-1.5.2/lib/rack/handler/webrick.rb:61:in`service'
    /usr/local/lib/ruby/2.1.0/webrick/httpserver.rb:139:in `service'
    /usr/local/lib/ruby/2.1.0/webrick/httpserver.rb:95:in`run'
    /usr/local/lib/ruby/2.1.0/webrick/server.rb:296:in `block in start_thread'

</code>

