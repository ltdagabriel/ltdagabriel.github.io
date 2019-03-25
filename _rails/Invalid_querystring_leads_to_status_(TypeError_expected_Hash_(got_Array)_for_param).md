---
title: Invalid querystring leads to status 500 (TypeError: expected Hash (got Array) for param)
labels: actionpack
layout: issue
---

If a request contains an invalid querystring, Rails responds with a 500 - server error.

Eg: http://www.crunchbase.com/?foo[]=array&foo[hash]=hash

Rack `Utils#normalize_params` expects the input to be a hash in this case, but foo[]=array looks like an array.

I'd expect: 400 Bad Request - The request could not be understood by the server due to malformed syntax.

