---
title: undefined method 'clear' for nil:NilClass in actionpack-4.2.0/lib/action_controller/test_case.rb
labels: actionpack
layout: issue
---

In some rspec before(:all) blocks it seems like the setup_subscriptions method in this file is not being called, resulting in the a nil instance_variable when reset_template_assertion is called.

more info can be found in this stackoverflow question

http://stackoverflow.com/questions/27727786/rails-4-2-update-method-fails-only-when-called-from-beforeall-block

```
def reset_template_assertion
  RENDER_TEMPLATE_INSTANCE_VARIABLES.each do |instance_variable|
    instance_variable_get("@_#{instance_variable}").clear
  end
end
```

for now I just added a check to make sure the variable is not nil before calling clear on it, but I am not sure if the problem is that the setup_subsriptions **should** have been call and was not.

```
def reset_template_assertion
  RENDER_TEMPLATE_INSTANCE_VARIABLES.each do |instance_variable|
    variable_name = "@_#{instance_variable}"
    variable = instance_variable_get(variable_name)
    variable.clear if variable
  end
end
```

