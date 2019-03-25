---
title: Remove ActionController::HideActions
labels: actionpack
layout: issue
---

The whole concept of hidden actions was when we allowed all public methods of a controller to be auto-available through the router. We no longer do. So strip it out. Since it actually doesn't even do anything at this point, I wonder if we even need a deprecation step.

