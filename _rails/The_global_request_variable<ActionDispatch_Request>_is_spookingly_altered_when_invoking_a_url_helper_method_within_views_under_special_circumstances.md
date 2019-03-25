---
title: The global request variable<ActionDispatch::Request> is spookingly altered when invoking a url helper method within views under special circumstances
labels: actionpack, attached PR, routing
layout: issue
---

Hello everyone,
I think I've found a spooky bug in Rails `~> 5.0.0.beta1`( last commit 179df9df6839 ).
**The code below worked perfectly fine on Rails `~> 4.2.0`**

Consider this dead simple `erb` view, under specific circumstances(which I will outline below), the `request<ActionDispatch::Request>` instance variable is changed, simply by invoking `root_path`:

``` erb

# GET /action_1 
# Before invoking root_path, the value of request.path_parameters is:
# request.path_parameters = {.. action: action_1 ..}

# An innocent call:
<% root_path %>

# AFTER invoking root_path, the value of request.path_parameters is:
# notice that the action value changed from :action_1 to :index
# request.path_parameters = {.. action: **index**  ..}

# EXAMPLE:
#url_for is using request.parameters under the hood to build its options; hence it's completely
# broken now(it points to index action or crashes when it does not exist; instead of action_1)

<%= url_for(locale: :ar) %>
# UrlGenerationError: No route matches {:action=>"index", :controller=>"custom", :locale=>:ar}

```
# Reproduction:

`Gemfile`:

``` Ruby

source 'https://rubygems.org'

ruby '2.3.0'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', github: 'rails/rails' #last commit 179df9d at the time of writing

gem 'sqlite3'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'
end

group :development do
  gem 'web-console', '~> 3.0'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]


```

`routes.rb`:

``` ruby
Rails.application.routes.draw do


  scope "/:locale", locale: /en|ar/ do

    root "application#index"

    get 'action_1' => 'custom#action_1'
  end
end

```

`custom_controller.rb`:

``` ruby
class CustomController < ActionController::Base

  def action_1
  end

end
```

`custom/action_1.html.erb`:

``` erb

# original (expected) value of request here...
<%= root_path %>

# modified (unexpected) value of request

# unexpected URL is generated here, since action the key used internally by #url_for is index and not action_1
<%= url_for(locale: :ar) %>

# Error raised by #url_for in this example:
# ActionController::UrlGenerationError in Custom#action_1: No route matches {:action=>"index", :controller=>"custom", :locale=>:ar}

```
# Blind Workaround: 

**Although the root path is being defined within a scope, which makes no sense; the bug itself could possibly point to a deeper problem, especially that it did not exist in Rails 4.2**
For those of us who have to use Rails 5 awesomeness while this bug is still alive and kicking, I found a blind workaround for this, simply move out the `root "application#index"` outside the scope block, and the bug will magically disappear.

new `routes.rb`:

``` ruby
Rails.application.routes.draw do

  root "application#index"

  scope "/:locale", locale: 'en' do


    get 'action_1' => 'custom#action_1'
  end
end

```

Ruby: 2.3.0
Ubuntu 15.10 x86_32

