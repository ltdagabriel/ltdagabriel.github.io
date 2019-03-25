---
title: Inflector support for routes and acronyms
labels: railties, stale
layout: issue
---

I have the following inflection rules

```
  inflect.acronym 'UI'
  inflect.acronym 'SIMs'
  inflect.acronym 'SIM'
  inflect.irregular 'SIM', 'SIMs'
```

I have the following routing rule

```
resource :x
resource :sim do
end
end
```

When I run `rake routes`

```
        x_sim POST   /x/sim(.:format)              my_friends/core/ui/sIMs#create
    new_x_sim GET    /x/sim/new(.:format)          my_friends/core/ui/sIMs#new
   edit_x_sim GET    /x/sim/edit(.:format)         my_friends/core/ui/sIMs#edit
                         GET    /x/sim(.:format)              my_friends/core/ui/sIMs#show
                         PUT    /x/sim(.:format)              my_friends/core/ui/sIMs#update
                         DELETE /x/sim(.:format)              my_friends/core/ui/sIMs#destroy
```

Note that the capitalization on SIMs is already broken in the routes.

Nevertheless when I access /x/sim/new it gives me

```
uninitialized constant MyFriends::Core::UI::SIMsController
```

Which is strange since it is defined in `my_friends/core/ui/sims_controller.rb` (renaming sims_controller doesn't help)
Other controller in the same directory are correctrly found and working

A similar issue is reporter at http://stackoverflow.com/questions/9522843/impossible-to-get-pluralized-acronym-route-working

I am using rails 3.2.8

