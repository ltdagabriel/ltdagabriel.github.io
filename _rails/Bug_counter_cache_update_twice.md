---
title: Bug: counter_cache update twice
labels: activerecord
layout: issue
---

Example

``` ruby
# topic model
  belongs_to :node,       counter_cache: true
```

``` ruby
topic = Topic.find(1)  # node_id = 2
node = Node.find(1)

topic.node = node
topic.save
```

when you do that, active record update both node(id = 2) and node(id=1) topics_count twice. which make one add 2 and another minus 2

but if you do:

``` ruby
topic.node_id = node.id
topic.save
#or
topic.update_attributes(node_id: node.id)
```

you will be fine

