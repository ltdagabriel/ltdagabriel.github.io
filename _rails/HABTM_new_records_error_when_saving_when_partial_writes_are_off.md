---
title: HABTM new records error when saving when partial writes are off
labels: With reproduction steps, activerecord, attached PR
layout: issue
---

Example spec fail here - https://gist.github.com/malmckay/1262766f0d8980db6fe7

When I disable partial_writes my HABTM association error on save (in some cases).

PrimaryKey#id_was raises, because the join table does not have a primary key.

