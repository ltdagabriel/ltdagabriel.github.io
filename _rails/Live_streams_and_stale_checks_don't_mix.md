---
title: Live streams and stale checks don't mix
labels: actionpack
layout: issue
---

Reproduction instructions: http://intertwingly.net/tmp/liveStale.html

Remove either `ActionController::Live` or the `stale?` check, and the test will work.

