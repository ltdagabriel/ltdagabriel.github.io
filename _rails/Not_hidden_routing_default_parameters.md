---
title: Not hidden routing default parameters
labels: With reproduction steps, actionpack, attached PR, regression
layout: issue
---

### Expected behavior
Route generator should hide parameter if it is equal to default.

### Actual behavior
Route generator doesn't hide parameter

>   get '(:param1)/test(/:param2)' => "index#index", 
     :defaults => {
       :param1 => 1,
       :param2 => 2
    },
     :constraints => {
       :param1 => /\d*/,
       :param2 => /\d+/
     }

> url_for(:controller => "index", :param1 => "1")
 => "http://127.0.0.1:3000/1/test"

_(should be http://127.0.0.1:3000/test)_

**BUT**
> get '(:param1)/test' => "index#index", 
     :defaults => {
      :param1 => 1
    },
    :constraints => {
      :param1 => /\d*/
    }

> url_for(:controller => "index", :param1 => "1")
 => "http://127.0.0.1:3000/test"

I think here https://github.com/rails/rails/blob/v5.0.1/actionpack/lib/action_dispatch/journey/formatter.rb#L38 should be next instead of break

### System configuration
5.0.1

**Ruby version**:
2.3.3
