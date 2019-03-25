---
title: Confusing / unclear documentation for CSRF protection
labels: docs, needs feedback, security
layout: issue
---

I also [asked this on StackOverflow](http://stackoverflow.com/q/40706394/305019), but I think it's worth raising an issue. At the very least to improve documentation and make it clearer.

The [documentation on Request Forgery Protection](http://edgeapi.rubyonrails.org/classes/ActionController/RequestForgeryProtection.html) is a little confusing and unclear in certain parts. Specifically the example and surrounding text on the main text:

> It's important to remember that XML or JSON requests are also affected and if you're building an API you should change forgery protection method in ApplicationController (by default: :exception):
> 
> ```ruby
> class ApplicationController < ActionController::Base
>   protect_from_forgery unless: -> { request.format.json? }
> end
> ```
> CSRF protection is turned on with the protect_from_forgery method. By default protect_from_forgery protects your session with :null_session method, which provides an empty session during request.
> 
> We may want to disable CSRF protection for APIs since they are typically designed to be state-less. That is, the request API client will handle the session for you instead of Rails.

If I read this correctly, the first sentence says that "XML / JSON requests are also affected" (i.e. susceptible to CSRF attacks?), but then recommend bypassing CSRF protection for JSON requests.

Is this a contradiction? Or perhaps "affected" is there to mean "blocked (unnecessarily?) by CSRF protection" ?

Another source of confusion for me is whether turning off CSRF protection always implies managing your own session.

Lastly, I think it's worth pointing out (and please correct me if I'm wrong) that CSRF protection [isn't necessary for XHR](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet#Protecting_REST_Services:_Use_of_Custom_Request_Headers) as long as CORS is blocked for requests from untrusted domains. The last point is one I'm hoping to get some more clarity (and hence the SO question I mentioned).

Hope it's the right place to report or discuss this, but especially when it comes to security, it's very important that threats and countermeasures are crystal clear.
