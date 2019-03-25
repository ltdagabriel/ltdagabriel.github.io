---
title: improve the documentation of Active Job Queue Adapters
labels: activejob, docs
layout: issue
---

Extracted from #16576. CC @chancancode.

I wanted to know more about adapters. ["Backend Features" table](http://edgeapi.rubyonrails.org/classes/ActiveJob/QueueAdapters.html) is great but I don't quite understand it. What is the difference between Priorities = Yes and Priorities = Job? I'd think that there's nothing smaller than a job. Seems there is - what is it? Would be great to have it stated explicitly, e.g. "X" (whatever it is) instead of mysterious "Yes". Also, a short explanation of what "Job" and "X" are would be cool (it's clear for me what "Global" and "No" mean, obviously :))

Also, I don't quite understand why Active Job is listed on this list. Does Active Job (the abstraction layer) ship with Active Job (a queue runner)? If so, I think it's very unfortunate and will be the source of confusion. Some people will talk about the former and other about the latter. How about "Active Job Queue"?

