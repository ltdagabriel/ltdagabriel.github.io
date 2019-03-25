---
title: count_cache increment twice when using custom counter name
labels: activerecord, attached PR
layout: issue
---

In using Rails 4, I noticed consistently that when I do this,
  belongs_to :client, counter_cache: true
it works fine. 

When I do this,
  belongs_to :client, counter_cache: :column_name

then the increment doubled. Can anyone else reproduce this?

