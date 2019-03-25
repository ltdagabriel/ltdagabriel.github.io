---
title: ActionController::Live deadlock on `const_missing` after `SSE#write`
labels: actionpack, attached PR
layout: issue
---

I'm seeing a deadlock occur when a constant is being loaded after a call to `SSE#write`. This will only occur when there's some delay between the two.

In my exact scenario I'm using `Redis#subscribe` to run a GraphQL query when an event occurs. I was able to distill the issue down to the fact that running the query triggers `const_missing` which causes the deadlock. I created a basic Rails app without the Redis/GraphQL dependencies which reproduces the issue.

Of note is that if you use Rails `4.2.6` in my example app you don't run into the issue.
### Steps to reproduce

https://github.com/achinn/ac-live-deadlock
### Expected behavior

The SSE should close at the end of the HTTP request.
### Actual behavior

A deadlock occurs when a constant is being loaded.
### System configuration

**Rails version**: 5.0.0

**Ruby version**: 2.3.1p112

