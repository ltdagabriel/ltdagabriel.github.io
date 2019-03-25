---
title: Cannot add an existing readonly record to HMT collection
labels: activerecord
layout: issue
---

When I have a “has_many through” association where the “has_many” class is readonly, I get an error when replacing or adding _an unchanged record_ to the collection – that the collection class “is marked as readonly”.

I believe d849f42b4ecf687ed5350f5a2402fb795aa33aac is the first offending commit. It should probably have replaced `if record.new_record?` with `if !record.readonly?` instead of removing the condition.

Gist in https://gist.github.com/bquorning/55dffab8e8038fbe0119ef6d854a5090
### System configuration

**Rails version**: v5.0.0.beta1 and later. Master branch since commit d849f42b4ecf687ed5350f5a2402fb795aa33aac.

**Ruby version**: Tested with 2.3.0

