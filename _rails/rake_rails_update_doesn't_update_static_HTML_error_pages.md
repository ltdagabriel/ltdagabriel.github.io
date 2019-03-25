---
title: rake rails:update doesn't update static HTML error pages
labels: attached PR, railties
layout: issue
---

There apparently were changes made to:
- 404.html
- 422.html
- 500.html

http://railsdiff.org/html/v4.0.2-v4.1.0.beta1.html

Yet running `rake rails:update` doesn't update these default files. This doesn't seem coherent. Are these changes considered non-important?

