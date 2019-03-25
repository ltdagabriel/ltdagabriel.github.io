---
title: Using Rack HEAD causes CookieStore security warnings
labels: actionpack
layout: issue
---

Rack::Session::Cookie accepts a :secret option in its initializer. The initializer stores that secret in an instance variable and uses it in the `#set_session` method to HMAC sign the data.

Rack HEAD added security warnings for when the Rack::Session::Cookie middleware is initialized without a secret. 

This is causing the warning to show up because of the way Rails uses Rack::Session::Cookie:

Rails uses a subclass of Rack::Session::Cookie called ActionDispatch::Session::CookieStore that overwrites `#set_session` and `#set_cookie` to do its own signed cookie implementation using ActionDispatch::Cookies::SignedCookieJar (using Rack env `"action_dispatch.secret_token"` instead of the `@secret` instance variable). Since Rails doesn't need the `@secret` instance variable, it initializes ActionDispatch::Session::CookieStore without providing a :secret option.

To avoid the warning, we should just not use Rack::Session::Cookie. We're overriding a lot of the functionality for Rack::Session::Cookie anyway, to the point that its most important functionality (cookie signing) is not being used at all.

