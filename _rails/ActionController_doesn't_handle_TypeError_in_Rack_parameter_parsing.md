---
title: ActionController doesn't handle TypeError in Rack parameter parsing
labels: actionpack
layout: issue
---

Parsing a query string using `Rack::Utils.parse_nested_query` raises a `TypeError` when query parameters are ambiguous in that they seem to represent an Array and a Hash with the same name (e.g. `f[]=&f[4]=`). This is not handled by ActionController and so unparseable parameters result in a 500 error in a new app. (v3.1.0)

Since this happens pretty deep in the Rack code and `TypeError` is rather general it seems wrong to have to handle this in the rails app layer to prevent a 500.

It's easy to find examples of this issue in the wild:
https://github.com/?f[]=&f[4]=
http://twitter.com/?f[]=&f[4]=

I initially filed this bug against Rack (https://github.com/rack/rack/issues/222) but it seems that ActionController may be the place to handle this.

