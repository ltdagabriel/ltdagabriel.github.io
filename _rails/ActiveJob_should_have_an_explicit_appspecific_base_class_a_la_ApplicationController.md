---
title: ActiveJob should have an explicit app-specific base class a la ApplicationController
labels: activejob
layout: issue
---

Title's a mouthful, but having an explicit base class (and documentation that indicates how the queue adapter can be changed on it) will be hugely useful for users that wish to implement multiple job hierarchies. For instance, I may want my mail delivery jobs to have different durability semantics than my log processing jobs (which can be in-memory and best-effort).

/cc @strzalek @dhh 

