---
title: Params hash nil instead of empty array
labels: actionpack, attached PR
layout: issue
---

Ruby: 2.0.0p195
Rails: 4.0.0.rc2

When I send the following JSON POST request:

```
{
    "title": "Chart 1",
    "items": [{"id":1,"type":"text","tags":[],"content":"a"}],
    "type": "Multimedia"
}
```

Then the **params hash** has the following value:

```
{
    "title"=>"Chart 1",
    "items"=>[{"id"=>1, "type"=>"text", "tags"=>nil, "content"=>"a"}],
    "type"=>"Multimedia",
    "action"=>"create",
    "controller"=>"charts",
    "chart"=>{"type"=>"Multimedia", "title"=>"Chart 1"}
}
```

**"tags": []** is decoded to **"tags" => nil** but should be **"tags" => []**!

