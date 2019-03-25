---
title: FIXED Rails 4.0.0.beta1 undefined method `header' for #<ActionDispatch::Journey::Routes:0x9adc8a8>
labels: needs feedback, railties
layout: issue
---

This is now done a different way:-

``` ruby
# Define all resources
Rails.application.reload_routes!
all_routes = Rails.application.routes.routes

# Populate a table of controller and action names and controller_actions.
# Create Webmaster default role for each secure_resource.
all_routes.routes.each do |route|
  w = ActionDispatch::Routing::RouteWrapper.new(route)
  if w.endpoint == w.controller + "#" + w.action and !w.internal?
    c = ControllerName.find_or_create_by_name(w.controller)
    a = ActionName.find_or_create_by_name(w.action)
    res = ControllerAction.find_or_create_by_name(w.endpoint, :controller_name_id => c.id, :action_name_id => a.id)
    if !res.roles.include? 'Webmaster'
      role = Role.find_by_name('Webmaster')
      Interaction.create!([{:role_id => role.id, :controller_action_id => res.id}])
    end
  end
end
```

In my seeds.rb file:-

``` ruby
Rails.application.reload_routes!
all_routes = Rails.application.routes.routes

require 'action_dispatch/routing/inspector'
inspector = ActionDispatch::Routing::RoutesInspector.new(all_routes)

r =[]
for routeRule in inspector.format(all_routes, ENV['CONTROLLER'])
  # Parse routeRule to get your values
  routeRule.split(' ').each do |s|
    r << s if s.include?('#')
  end
end
```

The call `inspector.format(all_routes, ENV['CONTROLLER'])` generates the above error.

