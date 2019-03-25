---
title: ActionCable in app conflicts with force_ssl 
labels: actioncable, actionpack, attached PR
layout: issue
---

If running actioncable in app when the app is configured with force_ssl = true the SSL middleware 301s the wss requests to https which prevents the web socket communications from connecting

