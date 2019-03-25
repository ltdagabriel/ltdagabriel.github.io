---
title: Updating default settings of ApplicationController.renderer is not working
labels: actionpack
layout: issue
---

We generate an initializer `application_controller_renderer` to allow users to update the default config options for rendering templates outside of controller with following content.

``` ruby
# ApplicationController.renderer.defaults.merge!(
#   http_host: 'bigbinary.com',
#   https: true
# )
```

But the `ApplicationController.renderer.defaults` hash is frozen - https://github.com/rails/rails/blob/master/actionpack/lib/action_controller/renderer.rb#L45. So it raises an error if we try to modify it.

