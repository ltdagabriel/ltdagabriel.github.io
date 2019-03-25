---
title: simple_format fails with `Cannot modify SafeBuffer in place` in 3.1.0.rc2
labels: actionpack
layout: issue
---

Imagine some codes like this:

```
<%= simple_format "zomg" %>
```

This fails with:

```
Cannot modify SafeBuffer in place
activesupport (3.1.0.rc2) lib/active_support/core_ext/string/output_safety.rb:121:in `gsub!'
actionpack (3.1.0.rc2) lib/action_view/helpers/text_helper.rb:261:in `simple_format'
```

I also checked the tests for in the v3.1.0.rc2 tag for simple_format, and they seem to be failing with similar errors:

```
7) Error:
test_simple_format(TextHelperTest):
TypeError: Cannot modify SafeBuffer in place
/Users/technicalpickles/code/vendor/rails/activesupport/lib/active_support/core_ext/string/output_safety.rb:121:in `gsub!'
/Users/technicalpickles/code/vendor/rails/actionpack/lib/action_view/helpers/text_helper.rb:261:in `simple_format'
/Users/technicalpickles/code/vendor/rails/actionpack/test/template/text_helper_test.rb:27:in `test_simple_format'
/Users/technicalpickles/code/vendor/rails/activesupport/lib/active_support/testing/setup_and_teardown.rb:67:in `__send__'
/Users/technicalpickles/code/vendor/rails/activesupport/lib/active_support/testing/setup_and_teardown.rb:67:in `run'
/Users/technicalpickles/code/vendor/rails/activesupport/lib/active_support/callbacks.rb:426:in `_run_setup_callbacks'
/Users/technicalpickles/code/vendor/rails/activesupport/lib/active_support/callbacks.rb:81:in `send'
/Users/technicalpickles/code/vendor/rails/activesupport/lib/active_support/callbacks.rb:81:in `run_callbacks'
/Users/technicalpickles/code/vendor/rails/activesupport/lib/active_support/testing/setup_and_teardown.rb:65:in `run'
```

