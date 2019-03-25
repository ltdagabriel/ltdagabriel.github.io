---
title: ActionView::Helpers::TranslationHelper.translate makes unsafe values html_safe
labels: actionview
layout: issue
---

In rails 4.1.8, When I run this code:

``` ruby
   template.translate('key.that.does.not.exist', default: ['another.key.that.does.not.exists.html', 'key.that.exists'])
```

The returned value is HTML safe, but I would expect it not to be.  It seems that the html_safe key that is missing causes the returned value to be html_safe even if the returned value itself is not safe.

Perhaps this is related to #1102

