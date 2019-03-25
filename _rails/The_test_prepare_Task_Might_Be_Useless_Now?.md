---
title: The `test:prepare` Task Might Be Useless Now?
labels: activerecord, attached PR, needs feedback
layout: issue
---

Related to issue #17170, the `test:prepare` task is somewhat useless now? It is called before test helpers `ActiveRecord::Migration.maintain_test_schema!` so if anyone had to run prepare hooks "after" the schema is loaded, where do they do this?

