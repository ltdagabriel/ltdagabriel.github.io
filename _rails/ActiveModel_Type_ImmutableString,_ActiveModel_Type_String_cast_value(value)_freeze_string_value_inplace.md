---
title: ActiveModel::Type::ImmutableString, ActiveModel::Type::String #cast_value(value) freeze string value in-place
labels: With reproduction steps, activemodel, attached PR
layout: issue
---

### Steps to reproduce

not_frozen_string = ''
not_frozen_string.frozen? # false
cast_value(not_frozen_string)
not_frozen_string.frozen? # true
### Expected behavior

ActiveModel::Type::String#cast_value(value) doesn't freeze string value in-place
ActiveModel::Type::ImmutableString#cast_value(value) doesn't freeze string value in-place
### Actual behavior

ActiveModel::Type::String#cast_value(value) freezes string value in-place
ActiveModel::Type::ImmutableString#cast_value(value) freezes string value in-place
### System configuration

Rails master
### My monkey patch

``` ruby
ActiveModel::Type::ImmutableString.class_eval do
  def cast_value(value)
    case value
    when true then 't'.freeze
    when false then 'f'.freeze
    when ::String then ::String.new(value).freeze
    else value.to_s.freeze
    end
  end
end
```

