---
title: Overwrite controller namespace in route definition
labels: actionpack
layout: issue
---

**Example:**

``` ruby
namespace :namespace do
  get "/test", controller: "/module/controller"
end
```

Inside a `namespace` block there is no way to overwrite the controller namespace. 

Specifying the controller as `/module/controller` will result in the following route definition: `/namespace/module/controller`.
### Reproduction

``` ruby
# Activate the gem you are reporting the issue against.
gem 'rails', '4.0.0'

require 'rails'
require 'action_controller/railtie'

class TestApp < Rails::Application
  config.root = File.dirname(__FILE__)
  config.session_store :cookie_store, key: 'cookie_store_key'
  config.secret_token    = 'secret_token'
  config.secret_key_base = 'secret_key_base'

  config.logger = Logger.new($stdout)
  Rails.logger  = config.logger

  routes.draw do
    get '/' => 'test#index'
  end
end

class TestController < ActionController::Base
  def index
    render text: 'Home'
  end
end

require 'minitest/autorun'
require 'rack/test'

class BugTest < MiniTest::Unit::TestCase
  include Rack::Test::Methods

  def test_returns_success
    get '/'
    assert last_response.ok?
  end

  private
    def app
      Rails.application
    end
end
```
### Error

```
I, [2013-11-05T16:58:07.932991 #26898]  INFO -- : Started GET "/a/test" for 127.0.0.1 at 2013-11-05 16:58:07 +0100
F, [2013-11-05T16:58:07.936201 #26898] FATAL -- :
ActionController::RoutingError (uninitialized constant A):
  lib/action_dispatch/routing/route_set.rb:76:in `controller_reference'
  lib/action_dispatch/routing/route_set.rb:66:in `controller'
  lib/action_dispatch/routing/route_set.rb:44:in `call'
  lib/action_dispatch/journey/router.rb:71:in `block in call'
  lib/action_dispatch/journey/router.rb:59:in `each'
  lib/action_dispatch/journey/router.rb:59:in `call'
  lib/action_dispatch/routing/route_set.rb:682:in `call'
  lib/action_dispatch/middleware/params_parser.rb:27:in `call'
  lib/action_dispatch/middleware/flash.rb:241:in `call'
  lib/action_dispatch/middleware/cookies.rb:486:in `call'
  lib/action_dispatch/middleware/callbacks.rb:29:in `block in call'
  lib/action_dispatch/middleware/callbacks.rb:27:in `call'
  lib/action_dispatch/middleware/reloader.rb:64:in `call'
  lib/action_dispatch/middleware/remote_ip.rb:76:in `call'
  lib/action_dispatch/middleware/debug_exceptions.rb:17:in `call'
  lib/action_dispatch/middleware/show_exceptions.rb:30:in `call'
  lib/action_dispatch/middleware/request_id.rb:21:in `call'
  lib/action_dispatch/middleware/static.rb:64:in `call'
  test.rb:36:in `test_returns_success'
```

