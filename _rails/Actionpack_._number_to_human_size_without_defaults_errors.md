---
title: Actionpack 3.1 - number_to_human_size without defaults errors
labels: actionview
layout: issue
---

When using number_to_human_size without any defaults in locale.yml, I get all sorts of error :

```
wrong argument type nil (expected Fixnum)
actionpack (3.1.0) lib/action_view/helpers/number_helper.rb:281:in `round'
actionpack (3.1.0) lib/action_view/helpers/number_helper.rb:281:in `number_with_precision'
actionpack (3.1.0) lib/action_view/helpers/number_helper.rb:362:in `number_to_human_size'

[...]

can't convert NilClass to String
actionpack (3.1.0) lib/action_view/helpers/number_helper.rb:285:in `escape'
actionpack (3.1.0) lib/action_view/helpers/number_helper.rb:285:in `number_with_precision'
actionpack (3.1.0) lib/action_view/helpers/number_helper.rb:362:in `number_to_human_size'
```

Adding defaults in locale.yml solved the problem. The format use was :

```
number:
    format:
      precision: 3
      separator: '.'
```

