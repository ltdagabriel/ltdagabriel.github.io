---
title: `request.remote_ip` appears to return the wrong IP address
labels: actionpack
layout: issue
---

The [last commit to the remote IP middleware](https://github.com/rails/rails/commit/6da2bc5fcc9aa35707250c8b348a045685ef62c7) appears to have deliberately reversed the algorithm that picks the remote IP out of a list of proxies. Unfortunately, the previous algorithm (which I wrote, and used in production with a few hundred thousand clients :P) is the one that agrees with the written spec for how X-Forwarded-For is supposed to work.

**tl;dr** plz to revert that part of the commit, I would like to be able to upgrade Rails and still have `remote_ip` return the right IP address.

