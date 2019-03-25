---
title: Cannot find certain keys in errors - Rails 5.0.0.rc1
labels: With reproduction steps, activemodel, activerecord, attached PR
layout: issue
---

### Steps to reproduce

Make a model with length validations. For instance: `validates :name, length: { in: 2..25 }`
Test against this model either in a test or console by inserting a too long name that is over 25 characters
Call `.errors.added?(:name, :too_long)` method on the validated object
### Expected behavior

The method should return `true`
### Actual behavior

It returns `false`
### System configuration

**Rails version**: 5.0.0.rc1

**Ruby version**: 2.3.0

This happens also for too_short and maybe for some others too.

In the screenshot you can see that the data is actually there but the `.added?` method is unable to see it. Also worth noting that the other key called `:invalid`is accessible.
![screenshot from 2016-06-16 00-57-38](https://cloud.githubusercontent.com/assets/5602603/16098757/5d2a5884-335d-11e6-9aa3-b8ee54ac2b06.png)

