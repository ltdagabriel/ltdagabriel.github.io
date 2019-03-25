---
title: Rails 4: cookies are invalidated after setting secret_key_base
labels: actionpack
layout: issue
---

The `UpgradeSignatureToEncryptionCookieStore` feature added by @spastorino in 8eefdb6d is great, but it only covers sessions using `CookieStore`, not cookies in general.

When upgrading an app from 3.x to 4.0, all cookies are invalidated if you set `secret_key_base` as recommended by the deprecation warnings from (https://github.com/rails/rails/blob/master/railties/lib/rails/application.rb#L138) and the upgrade guide (https://github.com/rails/rails/blob/master/guides/source/upgrading_ruby_on_rails.md#action-pack). 

I made an example app to demonstrate the issue here: https://github.com/trevorturk/rails-cookie-issue

This isn't really a bug -- more of a feature request. I think it's an important one, though. 

Should we start by adding a caveat into the upgrade guide explaining the situation?

In terms of adding the feature, I think we'd need a new cookie jar that would operate a bit like `UpgradeSignatureToEncryptionCookieStore` and a way for your app to opt into that cookie jar. 

Thoughts? /cc @dhh, @jeremy, @spastorino 

