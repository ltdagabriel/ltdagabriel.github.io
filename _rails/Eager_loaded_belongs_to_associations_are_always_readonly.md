---
title: Eager loaded belongs_to associations are always readonly
labels: With reproduction steps, activerecord, attached PR
layout: issue
---

### Steps to reproduce

https://gist.github.com/bquorning/0ac738564824aa8ce57b
### Expected behavior

Eager loaded belongs_to associations should not be readonly.
### Actual behavior

Eager loaded belongs_to associations are always readonly.
### System configuration

**Rails version**: v5.0.0.beta1 and up, including latest master

**Ruby version**: All.
### Extra

It seems the issue was introduced in #18097.

