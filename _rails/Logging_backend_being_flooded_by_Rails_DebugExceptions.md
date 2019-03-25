---
title: Logging backend being flooded by Rails 5 DebugExceptions
labels: actionpack, attached PR
layout: issue
---

### Steps to reproduce
1. Set up Rails application that uses the [gelf-rb](https://rubygems.org/gems/gelf) gem to log to a Graylog backend.
2. Trigger an exception in the application.
### Expected behavior

A single message is logged, with the exception.
### Actual behavior

Hundreds of messages are logged for a single exception, including one for each line of the stack trace.
### System configuration

Rails 5.0.0
Ruby 2.3.0

