---
title: Mountable engines without ActiveRecord can't run the test suite
labels: activerecord, attached PR, railties
layout: issue
---

### Steps to reproduce

```sh
rails plugin new -O --mountable minimal_test_case
cd minimal_test_case/
# <remove TODOs from gemspec>
bundle install
rails test
```

[Minimal Test Case](https://github.com/jmmcduffie/rails-minimal-test-case)

### Expected behavior

The test suite should pass.

### Actual behavior

This error is thrown:
```
/usr/local/var/rbenv/versions/2.2.6/lib/ruby/gems/2.2.0/gems/railties-5.0.2/lib/rails/application/configuration.rb:143:in `database_configuration': Cannot load `Rails.application.database_configuration`: (RuntimeError)
Could not load database configuration. No such file - ["config/database.yml"]
```

### System configuration
**Rails version**: 5.0.2
**Ruby version**: 2.2.6

