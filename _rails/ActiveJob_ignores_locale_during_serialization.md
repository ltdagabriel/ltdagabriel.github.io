---
title: ActiveJob ignores locale during serialization
labels: activejob, attached PR
layout: issue
---

The current ActiveJob implementation does not store `I18n.locale` during its serialization.

This results e.g. in emails, that are sent with the wrong language settings, described in #20774.

My previous PR #20758 didn't tackle the problem right, it just solved it on the layer of ActionMailer. The expected behavior would be that the locale is stored on and restored from the queue and is used while performing the job. 

