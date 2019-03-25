---
title: Engines don't have a valid gemspec
labels: attached PR, engines
layout: issue
---

When I create an engine with `rails plugin new blorgh --mountable`, I get

```
Using blorgh (0.0.1) from source at /Users/steve/tmp/blorgh 
blorgh at /Users/steve/tmp/blorgh did not have a valid gemspec.
This prevents bundler from installing bins or native extensions, but that may not affect its functionality.
The validation message from Rubygems was:
  "FIXME" or "TODO" is not an author
```

