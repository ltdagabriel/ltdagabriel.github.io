---
title: Constraints for route overriders constraints in parent scope
labels: actionpack, routing, stale
layout: issue
---

Given this `routes.rb`:

``` ruby
Rails.application.routes.draw do
  scope :foo, constraints: proc { p 'foo constraint' } do
    get 'bar', to: 'home#index'
    get 'baz', to: 'home#index', constraints: proc { p 'baz constraint' }
  end
end
```

When requesting `/foo/bar` the constraint that prints "foo constraint" is called, as expected. 

But when requesting `/foo/baz` only the "baz constraint" gets called. Shouldn't both the "foo constraint" of the parent scope and the "baz constraint" be checked in this case?

This is a very dummy example. But i stumbled upon this problem on an app where a parent scope had a constraint to check that all its routes had a valid subdomain, and then a route inside of that scope had another constraint to check something specific to that route. That specific check was working, but not the subdomain check, leading to some confusing breakage hehe. A possible workaround is to also check for the subdomain inside that specific route constraint, but i think it'd be better if constraints could be naturally "nested".

BTW: This was tested on Rails 4.1.1.

