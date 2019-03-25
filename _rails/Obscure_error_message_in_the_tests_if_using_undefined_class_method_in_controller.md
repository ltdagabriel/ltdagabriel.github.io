---
title: Obscure error message in the tests if using undefined class method in controller
labels: actionpack
layout: issue
---

Imagine I have a controller and call some method on it that is missing:

``` ruby
class ImagesController < ApplicationController
  unexistent_method # method with such name is not defined

  def index
  end

end
```

(actually I ran into this bug when I tried to call `caches_action` without proper gem)

And I have a test

``` ruby
class ImagesControllerTest < ActionController::TestCase

  def test_index
    get :index
  end
end
```

When I run the tests with `rails test test/functional/images_controller_test.rb` I get the following obscure error:

```
ERROR ImagesControllerTest#test_get_index (0.59s)
  RuntimeError:   @controller is nil: make sure you set it in your test's setup method.
  /home/vk/.rvm/gems/ruby-2.0.0-p0@rails4/bundler/gems/rails-2d33796457b1/actionpack/lib/action_controller/test_case.rb:631:in `block in check_required_ivars'
  /home/vk/.rvm/gems/ruby-2.0.0-p0@rails4/bundler/gems/rails-2d33796457b1/actionpack/lib/action_controller/test_case.rb:629:in `each'
  /home/vk/.rvm/gems/ruby-2.0.0-p0@rails4/bundler/gems/rails-2d33796457b1/actionpack/lib/action_controller/test_case.rb:629:in `check_required_ivars'
  /home/vk/.rvm/gems/ruby-2.0.0-p0@rails4/bundler/gems/rails-2d33796457b1/actionpack/lib/action_controller/test_case.rb:531:in `process'
  /home/vk/.rvm/gems/ruby-2.0.0-p0@rails4/bundler/gems/rails-2d33796457b1/actionpack/lib/action_controller/test_case.rb:64:in `process'
  /home/vk/.rvm/gems/ruby-2.0.0-p0@rails4/bundler/gems/rails-2d33796457b1/actionpack/lib/action_controller/test_case.rb:468:in `get'
  test/functional/images_controller_test.rb:11:in `block in <class:ImagesControllerTest>'
```

If there are many tests in the file, the first one fails with this error but the following ones fail with different kinds of errors, e.g. saysing that action is missing from the controller while the action is actually there. Or sometimes it looks that request got to the controller but the `setup` block was not executed.

---

This error was also happenning  on 4.0.0.beta1, before `rake` test was switched to `rails test`.

As a comparison, on 3.2.13 such test just fails to start with comprehensive message

```
undefined local variable or method `unexistent_method' for ImagesController:Class (NameError)
```

