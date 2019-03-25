---
title: image_tag("") tries to get an image from the asset_pipeline
labels: actionview
layout: issue
---

When image_tag receives a blank string, it tries to get a resource from the asset pipeline and returns 

```
"isn't precompiled"
```

IMHO it should return a blank `<img src=""/>` or something like it.

