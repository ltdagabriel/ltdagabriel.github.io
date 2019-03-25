---
title: class_attribute not thread-safe
labels: activesupport, attached PR
layout: issue
---

I'm encountering this issue in a production application with the Paper Trail gem. (See https://github.com/airblade/paper_trail/issues/307). It's running in JRuby/TorqueBox under Rails 3.2.16. The implementation in Rails 4 looks nearly identical.

If I understand the [implementation](https://github.com/rails/rails/blob/v3.2.16/activesupport/lib/active_support/core_ext/class/attribute.rb#L80) of `class_attribute` correctly, every time you set the class attribute, it undefines the existing singleton method and defines a new singleton method that simply returns the new value.

In my app, several threads are setting the class attribute of different instances of the same class. This causes the singleton method of the class to be undefined in one thread, and then another thread raises a `NameError` because the method has been temporarily removed.

It sounds like an unlikely scenario, but this is happening a couple times a day in a relatively low-traffic app.

`class_attribute` is pretty complex, so I'm not sure how to fix this while retaining the existing functionality. Any advice would be appreciated. Perhaps putting a mutex around the code that undefines/defines would be best?

