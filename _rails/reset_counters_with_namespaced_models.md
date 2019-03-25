---
title: reset_counters with namespaced models
labels: activerecord
layout: issue
---

Hi.

I have the following issue:
When I try to use reset_counters on any of my associations with a counter_cache, i got the following error:

```
NoMethodError: undefined method `counter_cache_column' for nil:NilClass
```

I read documentation, and finally, had to open github, look at counter_cache.rb and test it in a rails console.

``` ruby
        child_class = has_many_association.klass
        belongs_to = child_class.reflect_on_all_associations(:belongs_to)
        reflection = belongs_to.find { |e| e.class_name == expected_name }
        counter_name = reflection.counter_cache_column
```

Error is on line 31 `counter_name =` because `reflection` is nil.
In my case, my models are namespaced (writing an engine).

Then, on line 30 `reflection =`, it can't find any association with expected_name.
Because `expected_name` is `Formol::Topic` and `e.class_name` is `Topic`

I fixed the error by specifying manually the `class_name` in `belongs_to`.
I don't know if `class_name` can be "guessed" in a better way with namespaces for `reset_counters` but it will be great.
It's a little bit shame to have to specify `class_name` on the association only to use reset_counters.

Best regards and happy new year.

