---
title: Rails Engine not properly generating named paths when a used nested resource and render is called through a helper method
labels: engines
layout: issue
---

Hello,

I've started to experiment with Rails engines, and noticed some odd behavior with Rails Engines and generating names paths when the engine is mounted as a nested resource.

```
Rails.application.routes.draw do
    resources :people do
        #when the engine is mounted as a nested resource, it works as desired, except when it comes to generating our paths in our engine's helpers
        mount BucketList::Engine => "/" #the goal is to access our lists like: person/:person_id/lists
    end

    #I don't want the route to be mounted at the top level, lists are owned by people
    #mount BucketList::Engine => "/bucket_list"

    #When I try to trick the route, I get the following error: ActionController::RoutingError (No route matches {}): app/views/people/show.html.erb:4:in `_app_views_people_show_html_erb___209278167088923249_70190424439760'
    #mount BucketList::Engine => "/people/:person_id/"
end
```

I have an engine that provides a simple todo list with items, and my dummy application creates a `Person` model. The lists can be owned, using a polymorphic association `ownable`. I have a helper method defined that is patched into `ActiveRecord::Base` named `has_list`, which gives the model the proper polymorphic association. This is mixed into the application in `engine.rb`.

The application works perfectly as a nested resource, which is great. However, I wanted to extend the functionality a bit further by creating a few helper methods to generate some "standard" views on the fly (like when showing a person's details, it would be nice if a list of all their todo lists was visible on that page).  I opted to create a helper method to accomplish this goal `ownable_list_list`, which would take an ownable object and generate a simple list of all items with links to show/edit/delete. The helper simple calls render on `_ownable_list_list.html.erb` in my engine

following the advice provided in [The Ruby on Rails Guides](http://guides.rubyonrails.org/engines.html#routes), I prefixed all of my named links in `bucket_list` (and even tried `person_bucket_list`, which is the name given by the routes in the dummy application). However, I receive the following error when trying to use these helpers:

```
undefined method `segment_keys' for nil:NilClass in app/views/people/show.html.erb:4:in `_app_views_people_show_html_erb___4217889445762085296_70138985747440'
```

For some reason it looks like when an engine is used as a nested resource, it is not properly being loaded up in `ActiveController` within our application  so that we can properly generate our named routes (even when the named route is prefixed by our engine name or our generated name from our application's route file). A reason this behavior does not occur when used as a proper nested resource is that the application relinquishes control to the Engine at that point, which has its own route file and version of `ActiveController`. Plus the rendering is done within the scope of the Engine, as opposed to our helper, which "injects" the rendering into the scope of the application.

I've put my experiments into a git repo: https://github.com/LockeCole117/bucket_list

Excuse the mess, today I just wanted to see what Rails Engines were capable of.

Thanks for your time.

