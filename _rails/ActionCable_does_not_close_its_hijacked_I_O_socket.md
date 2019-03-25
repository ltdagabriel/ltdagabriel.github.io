---
title: ActionCable does not close its hijacked I/O socket
labels: actioncable
layout: issue
---

### Steps to reproduce
1. Start a web server using Phusion Passenger that opens a websocket connection
2. Refresh the page a few times
### Expected behavior

There should never be more than 1 concurrent session when you run `passenger-status`. And when you close the website there should be 0.
### Actual behavior

Sessions are leaked. The amount of open sessions will steadily increase.
### System configuration

**Rails version**: Rails 5.0.0rc2 (and probably 5.0.0 too, so sorry I didn't know you guys were gonna release tonight)

**Ruby version**: 2.3

Hey guys sorry I was doing some performance testing using Phusion Passenger today, and I found this bug. I assume it's in Puma as well though I don't know how to make Puma give that info. I'll follow up with a PR.

Some extra info:

According to the Rack spec it is the applications responsibility to close the hijacked I/O socket after its done. This should likely be done in `ActionCable::Connection::Stream#clean_hijacked_io`.

