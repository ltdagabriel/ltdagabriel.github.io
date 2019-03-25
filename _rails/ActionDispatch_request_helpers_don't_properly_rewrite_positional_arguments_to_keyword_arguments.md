---
title: ActionDispatch request helpers don't properly rewrite positional arguments to keyword arguments
labels: actionpack, attached PR, docs
layout: issue
---

The code that rewrites deprecated positional argument version of [`get`, `post`, `put`, etc](https://github.com/rails/rails/blob/master/actionpack/lib/action_dispatch/testing/integration.rb) does not properly rewrite positional arguments to keyword arguments. This appears to be an issue with nested hashes of params.

Here is the bug template to reproduce this:

``` ruby
begin
  require 'bundler/inline'
rescue LoadError => e
  $stderr.puts 'Bundler version 1.10 or later is required. Please update your Bundler'
  raise e
end

gemfile(true) do
  source 'https://rubygems.org'
  gem 'rails', github: 'rails/rails'
  gem 'arel', github: 'rails/arel'
  gem 'rack', github: 'rack/rack'
  gem 'sprockets', github: 'rails/sprockets'
  gem 'sprockets-rails', github: 'rails/sprockets-rails'
  gem 'sass-rails', github: 'rails/sass-rails'
end

require 'action_controller/railtie'

class TestApp < Rails::Application
  config.root = File.dirname(__FILE__)
  config.session_store :cookie_store, key: 'cookie_store_key'
  secrets.secret_token    = 'secret_token'
  secrets.secret_key_base = 'secret_key_base'

  config.logger = Logger.new($stdout)
  Rails.logger  = config.logger

  routes.draw do
    resources :test, only: [:index]
  end
end

class TestController < ActionController::Base
  include Rails.application.routes.url_helpers

  def index
    render plain: 'Home'

    if params[:session][:password].nil?
      raise "parameter not present"
    end
  end
end

puts Rails.application.routes

require 'minitest/autorun'
require 'rack/test'

class TestControllerTest < ActionController::TestCase
  def setup
    @routes = Rails.application.routes
  end

  def test_with_positional
    get :index, session: { password: "foo" }
  end

  def test_with_kwargs
    get :index, params: { session: { password: "foo" } }
  end

  private
    def app
      Rails.application
    end
end
```

The `test_with_positional` method will blow up because `params[:session]` is nil in the controller.

