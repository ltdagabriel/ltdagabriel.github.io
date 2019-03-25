---
title: Config in config/puma.rb not working properly
labels: needs feedback, railties
layout: issue
---

The environment param in config/puma.rb is not setting to the value in RAILS_ENV, it is always set to the default value:

environment ENV.fetch("RAILS_ENV") { "development" }

This is getting set to "development" even when I have RAILS_ENV set to "production". This is happening on a production server.

