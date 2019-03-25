---
title: Joining more than 3 tables in a row and merging scopes crashes
labels: activerecord, attached PR
layout: issue
---

As seen in attached gist, I have created 5 tables, connected by belongs_to one to one relationships.

Joining 3 of them in order works fine, joining the 4th one yields an incorrect sql query, where the table join order is wrong, and joining 4 of them raises an ActiveRecord::ConfigurationError

I initially thought it is related to https://github.com/rails/rails/pull/15461 but I tried the patch and it does not solve this issue, so it might be a separate problem.

