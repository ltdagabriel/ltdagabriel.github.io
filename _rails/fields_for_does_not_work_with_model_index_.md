---
title: fields_for does not work with model :index 
labels: actionview, docs
layout: issue
---

as the docs indicate it should
http://guides.rubyonrails.org/form_helpers.html#using-form-helpers

index makes it to here without being transformed from a model

``` ruby
        def tag_name_with_index(index, multiple = false)
          "#{@object_name}[#{index}][#{sanitized_method_name}]#{"[]" if multiple}"
        end
```

