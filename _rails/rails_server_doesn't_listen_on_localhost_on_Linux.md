---
title: `rails server` doesn't listen on `localhost` on Linux
labels: railties
layout: issue
---

In the past, after running `rails server` without the `-b` option, it was possible to access the Rails app on http://localhost:3000. Since Rails 5 (or 5.1?), it will bind to the system's hostname instead.

I've tracked this down to the use of the `$HOST` env variable in https://github.com/rails/rails/blob/master/railties/lib/rails/commands/server/server_command.rb, which is used together with `$PORT` to determine the listening options for the webserver. It seems this was done to make it configurable by setting these variables explicitly; however on some Linux variants (at least SuSE), `$HOST` is set by default and is equal to `$HOSTNAME`. This can either cause the server to bind to that hostname, or even, if the hostname doesn't resolve, to refuse to start.
