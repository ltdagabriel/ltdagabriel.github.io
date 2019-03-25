---
title: rake assets:precompile cannot be used with relative url root
labels: asset pipeline
layout: issue
---

There is no way to tell the assets:precompile task that the application is deployed on a relative url root.
Trying to set RAILS_RELATIVE_ROOT does nothing, and setting config.action_controller.relative_url_root fails with undefined method `relative_url_root=' for ActionController::Base:Class.

