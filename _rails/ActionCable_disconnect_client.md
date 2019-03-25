---
title: ActionCable disconnect client
labels: actioncable, attached PR
layout: issue
---

I'm not if this is an issue or get something wrong. I'm using ActionCable.beta2 and i'm trying to do kind of "available online" chat feature. It's obvious that `subscribed` method is called when user is connected to channel, but `unsubscribed` is never called. I tried waiting for few hours, turning off browser or even computer. Every page refresh adds new subscriber to list, but there is no event to unsubscribe one. This leads to strange behaviour when message is broadcasted to huge amount of subscribers even when they are not really connected.

So my question is - what are the requirements to user get properly disconnected (on tab close, browser close or just navigate to subpage that don't have this channel subscription)?

PS. I set logger on disconnect in Connection too, it's just.. never called. I'm using Puma server and async adapter on development environment.

