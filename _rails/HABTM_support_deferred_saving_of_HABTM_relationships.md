---
title: HABTM: support deferred saving of HABTM relationships
labels: activerecord
layout: issue
---

This is a reopening of issue #674, which seems to have been auto closed on import fro Lighthouse.   This is still very much an issue and IMHO, the current way of auto-saving HABTM relationships is contrary to what is expected. And the fact that things are auto-saved has bitten out several hours of tracking down a bug in our application which resulted in me finding that HABTM saving doesn't work as I expect they should.

Specifically..

``` ruby
def Sprocket < ActiveRecord::Base
  has_and_belongs_to_many :users
end

#  later... in a controller

def create
  @sprocket = Sprocket.new params[:sprocket]
  if @sprocket.save
     # we saved correctly  blah blah
  else
   # we failed blah blah
  end
end
```

Now if I post with this hash data

``` ruby
{ :sprocket => {
    :name => 'My new sprocket'
    :user_ids => [ 3, 54 ]
}}
```

a new Sprocket will be created but with NO users associated with it!!!

if I save first and then clear and set the user_ids member then it'll be saved..
(Note this is on Rails 3.0.x that the application is currently written against)

