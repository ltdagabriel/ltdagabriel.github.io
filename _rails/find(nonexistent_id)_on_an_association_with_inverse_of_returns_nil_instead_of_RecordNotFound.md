---
title: find(non-existent id) on an association with inverse_of returns nil instead of RecordNotFound
labels: activerecord
layout: issue
---

If a given has_many association includes the inverse_of option, then calling find on the association with an non-existent id just returns nil. If the inverse_of option is removed, the usual RecordNotFound is raised.

I've tracked down the issue to commit 840ca09.

