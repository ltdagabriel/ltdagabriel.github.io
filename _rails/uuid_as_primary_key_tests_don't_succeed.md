---
title: uuid as primary key tests don't succeed
labels: activerecord, attached PR
layout: issue
---

It appears that a UUID primary key is causing tests with relationships to fail trying to insert integers instead of using uuids when defining relationships in fixtures.

