---
title: image_submit_tag doesn't support :disable_with option
labels: actionview
layout: issue
---

The `submit_tag` helper has a `:disable_with` option that creates the `data-disable-with` attribute used by rails-ujs. The data-disable-attribute works with image submit tags as well, but `image_submit_tag` has no such helper; the only way to create the attribute is the ugly and inconsistent `:"data-disable-with"`option. Can `:disable_with` be added to `image_submit_tag`?

