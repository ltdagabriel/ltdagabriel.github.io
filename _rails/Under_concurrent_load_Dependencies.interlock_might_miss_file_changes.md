---
title: Under concurrent load Dependencies.interlock might miss file changes
labels: activesupport, regression
layout: issue
---

While helping @mperham in #20989 I realized that the current code (under concurrent load) is broken.

The problem arises if there are multiple threads in app space region of `Dependencies.interlock`, then an `.rb` file is changed. Next thread arrives at `ActionDispatch::Reloader` middleware, it invokes `reloaders` to check if any of the files have changed, and indeed there is a change, the thread attempts to grab an exclusive `Dependencies.interlock` (via poll) does not succeed (because of those other threads in app space) and proceeds on.

However `reloaders` report a change in `.rb` file only once, subsequent calls to `updated?` return `false`, this is because since the last time `updated?` has been invoked nothing has changed, so if an exclusive grab of `Dependencies.interlock` was not successful a change to `.rb` file is "lost".

Additionally, if a typical use case of `sidekiq` is somewhat similar to @mperham's example in https://github.com/rails/rails/pull/20928#issuecomment-123876079, I'm fairly confident that even if the "lost" `.rb` change issue is fixed, unless `unloading` is blocking (and an attempt to obtain an exclusive lock blocks out new readers), then update is going to be probably "starved" anyways.

/cc @matthewd

