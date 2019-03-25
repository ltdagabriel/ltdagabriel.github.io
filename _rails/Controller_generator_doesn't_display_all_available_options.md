---
title: Controller generator doesn't display all available options
labels: attached PR, railties
layout: issue
---

### Steps to reproduce

When running `rails g controller`, the output doesn't include all available options. This is the output for Rails 4.2.6:

```
Options:
      [--skip-namespace], [--no-skip-namespace]  # Skip namespace (affects only isolated applications)
      [--skip-routes], [--no-skip-routes]        # Don't add routes to config/routes.rb.
  -e, [--template-engine=NAME]                   # Template engine to be invoked
                                                 # Default: erb
  -t, [--test-framework=NAME]                    # Test framework to be invoked
                                                 # Default: test_unit
      [--helper]                                 # Indicates when to generate helper
                                                 # Default: true
      [--assets]                                 # Indicates when to generate assets
                                                 # Default: true
```

And this is the output for Rails 5.0.0.beta3:

```
Options:
      [--skip-namespace], [--no-skip-namespace]  # Skip namespace (affects only isolated applications)
      [--skip-routes], [--no-skip-routes]        # Don't add routes to config/routes.rb.
                                                 # Default: true
  -e, [--template-engine=NAME]                   # Template engine to be invoked
                                                 # Default: erb
  -t, [--test-framework=NAME]                    # Test framework to be invoked
                                                 # Default: test_unit
```

Notice that even though options aren't displayed, one can still use these options.

```
$ rails g controller foo bar --no-helper --no-assets --skip-routes --no-test-framework
      create  app/controllers/foo_controller.rb
      invoke  erb
      create    app/views/foo
      create    app/views/foo/bar.html.erb
```
### Expected behavior

Help command should display all available options.
### Actual behavior

Help command is not displaying all available options.
### System configuration
- **Rails version**: 5.0.0.beta3
- **Ruby version**: 2.3.0

