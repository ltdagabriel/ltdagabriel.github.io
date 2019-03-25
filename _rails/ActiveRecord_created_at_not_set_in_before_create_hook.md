---
title: ActiveRecord created_at not set in before_create hook
labels: activerecord
layout: issue
---

On 4.1.2.rc1 the created_at is nil on before_create hook (this was not the behavior on latest release). Is this a bug or you are planning to really change this behavior? 

Follow a gist to reproduce the case: 

https://gist.github.com/everton/91a2cb2aed4258218ad9

Ping @rafaelfranca 

