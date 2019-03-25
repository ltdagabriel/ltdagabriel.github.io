---
title: Rails 4 Custom Flash Type Undefined After Error
labels: actionpack
layout: issue
---

I've created a custom flash type in my rails 4.0.0 application:

``` Ruby
class ApplicationController < ActionController::Base
  #...snip...

  add_flash_types :success

  #...snip...

end
```

and then consumed it in the default layout:

``` haml
!!!
%html
  %head
  %body
    %header
    = render 'navbar'
    .container
      .row
          .col-md-12
            - unless success.nil?
              %p.alert.alert-success= success
            - unless notice.nil?
              %p.alert.alert-info= notice
            - unless alert.nil?
              %p.alert.alert-danger= alert
            =yield
    %footer
```

The odd part is that these work fine, until I hit another RailsException that throws the current page into an error state. Once that happens, it always comes up with the error:

```
NameError in Application#home
Showing app/views/layouts/application.html.haml where line #31 raised:

undefined local variable or method `success' for #<#<Class:0x000000045e26b8>:0x000000045e18d0>
             .col-md-12
               - unless success.nil?
                 %p.alert.alert-success= success
               - unless notice.nil?
                 %p.alert.alert-info= notice
```

Once I kill this server and start it again, the same page refresh works just fine.

I'd obviously prefer not to have to kill my server and restart it everytime during development. I've searched around a bit, but it's an awkward situation and new feature, so there's not much out there about Rails 4 custom flash types.

If anyone has any ideas, I'd really appreciate it!

Thanks

