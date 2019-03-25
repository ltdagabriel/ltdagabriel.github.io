---
title: tag data attributes has different behavior dependent on declaration
labels: actionview, attached PR
layout: issue
---

Rails helper converts attributes differently based on declaration.

```
> link_to 'aaa', '#', 'class' => nil, 'data-tooltip' => nil
=> "<a href=\"#\">aaa</a>"
> link_to 'aaa', '#', class: nil, data: {tooltip: nil}
=> "<a data-tooltip=\"null\" href=\"#\">aaa</a>"
```

I'd expect output to have no attributes with "null" value in both ways.
https://github.com/rails/rails/blob/master/actionview/lib/action_view/helpers/tag_helper.rb#L173-L179

