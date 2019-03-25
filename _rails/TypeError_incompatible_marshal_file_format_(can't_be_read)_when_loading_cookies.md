---
title: "TypeError: incompatible marshal file format (can't be read)" when loading cookies
labels: actionpack
layout: issue
---

This issue baffled us today, and caused 500 errors for some of our users.

The issue was caused by using action_dispatch.cookies_serializer = :hybrid, having config.secret_token & secrets.secret_key_base both set and setting a signed cookie in the code. The signed cookie will use json for serialization.

No when reading the cookie in the next request, the UpgradeLegacySignedCookieJar is used, which will eventually call VerifyAndUpgradeLegacySignedMessage#verify_and_upgrade_legacy_signed_message which uses the ActiveSupport::MessageVerifier (without setting a serializer) which will then use Marshal to load the json data.

Long story short, the UpgradeLegacySignedCookieJar is missing the SerializedCookieJars module.

