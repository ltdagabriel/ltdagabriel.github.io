---
title: Server-generated JS is not executed by rails-ujs on IE9.
labels: attached PR, rails-ujs
layout: issue
---

Not sure of IE9 support status re. rails-ujs, but unfortunately a tiny fraction of our users are still IE9. So:

### Steps to reproduce

Using IE9, submit a `remote: true` link, that gets a server-generated JavaScript response.

### Expected behavior

rails-ujs should execute the JS received.

### Actual behavior

rails-ujs does not execute the JS received, I think because it is using `xhr.response`, which was not in XMLHttpRequest Level 1.
Perhaps consider using `xhr.responseText` if `xhr.response` is `null`?

### System configuration
**Rails version**: 5.1

**Ruby version**: 2.3.4p301


