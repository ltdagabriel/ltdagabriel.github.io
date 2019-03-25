---
title: request.raw_post is empty on JSON request
labels: actionpack, regression
layout: issue
---

### Environment:
- Ruby 2.0.0-p0
- Rails 4.0.0
### Steps to reproduce:
- Create new web app using: rails new blog
- Create some controller: rails g controller posts
- Create a controller posts_controller.rb : 

``` ruby
class PostsController < ApplicationController
  self.allow_forgery_protection = false  # for curl purposes
  def create
    puts "this is request.raw_post = ",request.raw_post
    puts "this is request.params = #{request.params}"
    render text: params[:post].inspect
  end
end
```
- curl -v -H "Content-Type: application/json" -X POST -d '{"post":{"title":"my title"}}' http://localhost:3000/posts
### Expected:

raw_post conatins the raw content of the request (i.e. the JSON ojbect)
### Actual:

request.raw_post is empty
### Why this is important?

When I send json request I want to be able to use raw_post data and not solely rely on parsed parameters, for instance when I want to do my own parameters parsing. Further more, there is no consistency with the API, for instance for other types of content-type raw_post is used as expected.(e.g. in Proc strategy raw_post is used instead of body, whereas request.body is used for :json strategy)
### The source of this bug:

Parameter parser middleware in actionpack.
### Possible solution:

In actionpack-4.0.0/lib/action_dispatch/middleware/params_parser.rb 
data = ActiveSupport::JSON.decode(request.body) **becomes** 
data = ActiveSupport::JSON.decode(request.raw_post)

