---
title: Incorrect error message with accepts_nested_attributes_for / has_many
labels: With reproduction steps, activerecord, attached PR
layout: issue
---

Proof I have accepts_nested_attributes_for configured properly:

``` ruby
Dashboard.new(measures_attributes: [{name_of_measure: "Height"}])
#=> #<Dashboard id: nil, guid: nil, position: nil, display_label: nil, created_at: nil, updated_at: nil>
```

The incorrect error message:

``` ruby
Dashboard.new(measures_attributes: [{stinky: "yup"}])
#=> ActiveModel::UnknownAttributeError: unknown attribute 'measures_attributes' for Dashboard.
```

What the error should be:

``` ruby
Dashboard.new.measures_attributes = [{stinky: "yup"}]
#=> ActiveModel::UnknownAttributeError: unknown attribute 'stinky' for Measure.
```

