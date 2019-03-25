---
title: assert_template with :locals raises NoMethodError: undefined method `[]' for nil:NilClass
labels: actionview
layout: issue
---

### Observation

Consider a view such as the following:

**`foo/example.html.haml`**:

``` ruby
...
render :partial => 'foo/bar'
render :partial => 'foo/baz', :locals => {:var => 10}
...
```

The view test is as follows:

**`foo/example.html.haml_spec.rb`**:

``` ruby
...
it 'should render foo/bar.' do
  render
  # This works. An underscore *must* be used before partial name.
  assert_template :partial => 'foo/_bar' 
end

it 'should render foo/baz.' do
  render

  # This does *not* work, and raises NoMethodError: undefined method `[]' for nil:NilClass
  assert_template :partial => 'foo/_baz', :locals => {:var => 10}  

  # This *does* work, the difference being that
  # an underscore *must not* be used before the partial name.
  assert_template :partial => 'foo/baz', :locals => {:var => 10}  
end
...
```
### Expectation

Partial name should be specified in the same way regardless of whether locals are specified in assert_template or not.

