---
title: Why it's possible to invoke channel actions after subscription was rejected?
labels: With reproduction steps, actioncable, attached PR
layout: issue
---

Let's assume we called `reject` in `channel#subscribed`, then client ignores rejection and makes a call to some action in that channel, which is being successfully processed ignoring the fact that it was rejected. So each action should check for `subscription_rejected?` ?

