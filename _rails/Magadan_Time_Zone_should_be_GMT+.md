---
title: Magadan Time Zone should be GMT+10
labels: activesupport, attached PR
layout: issue
---

The Magadan time zone moved from GMT+12 to GMT+10 on October 26th, but this change is not reflected in ActiveSupport/tzinfo. We're getting a lot of errors from only Magadan time zone users (AmbiguousTime errors for 2014-10-26 midnight)

