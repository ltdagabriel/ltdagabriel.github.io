---
title: Controllers still try to render view when using "render json"
labels: With reproduction steps, actionpack, attached PR
layout: issue
---

### Steps to reproduce

**Routes**

``` ruby
Rails.application.routes.draw do
  resources :providers, only: [:create]
end
```

**Controller**

``` ruby
class ProvidersController < ApplicationController
  def create
    render json: { hello: 'world' }
  end
end
```

Make a POST HTTP request to `/providers` or `/providers.json` with `Accept` and `ContentType` headers set to `application/json`.

**EDIT** In order to reproduce this you will need to have `jbuilder` as a dependency.
### Expected behavior

Expecting the following JSON to render:

``` js
{
   "hello": "world"
}
```
### Actual behavior

Get the following error:

```
ActionView::MissingTemplate:
       Missing template providers/create, application/create with {:locale=>[:en], :formats=>[:json], :variants=>[], :handlers=>[:raw, :erb, :html, :builder, :ruby, :jbuilder]}. Searched in:
         * "/usr/src/app/app/views"
```

Rails still seems to be attempting to render a view template rather than the value provided to `render json`.
### System configuration

**Rails version**: 5.0.0.beta3

**Ruby version**: 2.3.0

