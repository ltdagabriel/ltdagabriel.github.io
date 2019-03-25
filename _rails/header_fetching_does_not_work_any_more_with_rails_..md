---
title: header fetching does not work any more with rails 4.2
labels: actionpack
layout: issue
---

Hi,

I have the following setup:

routes.rb

``` ruby
   get 'is-alive-token' => 'heart_beat#index'
```

heart_beat_controller,rb

``` ruby
class HeartBeatController < ApplicationController
  def index
    render json: {}, status: 200
  end
end
```

When I use:

```
  curl -I http://127.0.0.1:3000/is-alive-token
```

prior rails 4.2 I got `HTTP/1.1 200`

with rails 4.2 I get `HTTP/1.1 404` + an exception

``` ruby
ActionController::RoutingError (No route matches [HEAD] "/is-alive-token")
```

Is there a new directive within the routes to get HEAD calls up and running?

regards
dieter

