---
title: can't set default_url_options for integration tests
labels: actionpack
layout: issue
---

When writing integration tests, it would be preferable if url generation automatically made use of default_url_options as specified in ApplicationController. That said, the next best thing would be for default_url_options to be settable in the test environment, but I can't find any way to do that. This makes it impossible (or at least extremely awkward) to run integration tests when using a scope with a parameter in it.

Here's a simplified use case:
1. in routes.rb: 
   
   ```
   scope ':path_prefix' do 
     resources :foos 
   end 
   ```
2. in application_controller.rb 
   
   ```
   def default_url_options 
     { :path_prefix => 'test' } 
   end 
   ```
   
   foos_path will now resolve to /test/foos when referenced within controllers and views.
3. in test/integration/prefix_test.rb: 
   
   ```
   require 'test_helper' 
   class PrefixTest < ActionDispatch::IntegrationTest 
     test "path prefix" do 
       foos_path 
     end 
   end 
   ```
4. When running the test (rake test:integration), I get the following error:
   
   ```
   test_path_prefix(PrefixTest): 
   ActionController::RoutingError: No route matches {:controller=>"foos"} 
       /test/integration/prefix_test.rb:5:in `test_path_prefix' 
   ```

In my real case, path_prefix gets its value from params[:path_prefix] unless no prefix is specified. For example, something like this:

```
def default_url_options 
  { :path_prefix => params[:path_prefix] || 'test' } 
end 
```

