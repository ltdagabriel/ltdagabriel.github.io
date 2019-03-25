---
title: Relative URL + Engine = path doubling
labels: engines
layout: issue
---

In the current version of Rails if I mount an engine in an app and then assign it a relative path (config.relative_url_root), linking from the main app to the engine causes it to double the relative path. For example: the link_to helper generates '/relative/relative/ship' when it should just generate '/relative/ship'. Going from a page in the engine to the main app does not do this. I do not know what will happen with multiple engines mounted, but I am willing to try it.

I have created a barebones application to exemplify this problem here:   https://github.com/eltiare/relative-url-engine-bug

This is a big problem for those who use engines. I'm not sure how I'd go about writing a test case for this, but I will look into it tomorrow.

