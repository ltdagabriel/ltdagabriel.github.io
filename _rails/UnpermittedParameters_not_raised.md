---
title: UnpermittedParameters not raised
labels: actionpack, regression
layout: issue
---

### Steps to reproduce

In config/environments/test.rb (and development.rb) set
config.action_controller.action_on_unpermitted_parameters = :raise

Run a test that tries to pass a non whitelisted parameter to an action.

Rails 5.1.2 behaves fine, the moment we upgrade to 5.1.3RC3, the unpermitted parameter is logged instead of raised.

### Expected behavior
ActionController::UnpermittedParameters should be raised.

### Actual behavior
Nothing is raised, instead the unpermitted parameter ist logged and the transaction is executed.

### System configuration
**Rails version**:
5.1.3RC3

**Ruby version**:
2.4.1
