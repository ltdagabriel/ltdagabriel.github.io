---
title: group.sum returns string hash values if the column being summed is a string
labels: activerecord
layout: issue
---

group(:column_a).sum('CAST(column_b AS integer)')

