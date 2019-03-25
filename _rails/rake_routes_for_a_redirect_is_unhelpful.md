---
title: rake routes for a redirect is unhelpful
labels: actionpack
layout: issue
---

Given a route in routes.rb:

```
get '/e/:id' => redirect('/foo'), as: 'share_event'
```

When I run `rake routes`
Then I expect to see:

```
share_event GET  /e/:id(.:format)    redirect('/foo') # or something similar
```

But I currently see:

```
share_event GET  /e/:id(.:format)    :controller#:action
```

