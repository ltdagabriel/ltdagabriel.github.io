---
title: "render nothing: true" does not render exactly nothing
labels: actionpack
layout: issue
---

Due to some third-party api's need, I need to render EXACTLY nothing (i.e. a response with content length equals precisely to zero), but "render nothing: true" renders responses with content length 1, a single space.

For now, I have to use " render text: '' " instead.

