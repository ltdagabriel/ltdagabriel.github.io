---
title: Mounted Engine named_routes Regression in v4.2.3
labels: attached PR
layout: issue
---

When running a Rails v4.2.2 app under a relative url with an isolated mounted engine, the engine named route helpers generate the correct path. This is no longer the case in Rails v4.2.3 or 4-2-stable.

I believe the change in behavior stems from this commit: 0703453fabc4a47411c2f9df291acfdfbcaf5ae4.

Per 5b3bb61f3fb82c7300d4dac374fe7aeafff6bda0, mounted engines use `options[:original_script_name]` for the prefix generation instead of `options[:script_name]`. Defaulting an absent `options[:script_name]` with `relative_url_root` causes the code to include the relative url twice in the generated path (e.g. "/sub_uri/sub_uri/engine/route" instead of "/sub_uri/engine/route").

I have created a test app with a failing test to demonstrate this issue: https://github.com/merhard/rails-regression-testapp

Pull request for fix: #20958

