---
title: `rescue_from` can no longer handle wrapped exceptions
labels: With reproduction steps, actionpack, attached PR
layout: issue
---

Prior to #18774, it was possible, with `rescue_from`, to rescue wrapped exceptions. Many of my applications use this technique to centralize error handling (logging, metrics, API visible display, etc), by `rescue_from StandardError`, and a handful of "error type" wrapper exceptions, ie. `BadRequest`, etc. This allowed me to determine in a controller how to respond to a third party gem's failure, by raising the appropriate wrapper exception, without having to mention every possible third party failure in my generic error handling code, but still maintain common error handling for exceptions I wasn't expecting.

After the change in #18774, the wrapper exception's `cause` is being used to lookup a rescue handler. This means that if I don't have a handler registered for a specific exception (many coming out of third party gems), I can't rescue them, even if I catch and re-raise as a different type.
### Steps to Reproduce

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
    get '/' => 'test#index'
  end
end

# custom error classes
class BadRequestError < StandardError; end
class ThirdPartyGemError < StandardError; end

class TestController < ActionController::Base
  include Rails.application.routes.url_helpers

  # generic error handling, 1/0 should still log, metrics, etc.
  rescue_from StandardError, with: :error_handler

  # this is just a bad request from the client
  rescue_from BadRequestError, with: :specific_handler

  def third_party_code(arg)
    fail ThirdPartyGemError, "something specific happened"
  end

  def index
    data = third_party_code(params[:arg])
    render json: data
  rescue ThirdPartyGemError
    # third party gem failed, but I know it can only be because of bad request, use that
    fail BadRequestError, "failure to decode or whatever"
  end

  def error_handler(ex)
    render status: 500, plain: "generic handler"
  end

  def specific_handler(ex)
    render status: 400, plain: "bad request handler"
  end
end

require 'minitest/autorun'
require 'rack/test'

class BugTest < Minitest::Test
  include Rack::Test::Methods

  def test_returns_success
    get '/'
    assert_equal last_response.body, "specific handler"
    assert_equal last_response.status, 400
  end

  private
    def app
      Rails.application
    end
end
```

---

Note that as far as I can tell from the documentation, even prior to the change `rescue_from StandardError` must be the first call (such that it's on the bottom of the search stack). RailsGuides also mentions that it's not-advised to rescue `StandardError`, but claims that it's due to missing out on default functionality of getting stack traces on error in development.
### Expected behavior

The `specific_handler` method should be used to handle the raised `BadRequestError`.
### Actual behavior

The `generic_handler` method is used to handle the wrapped `ThirdPartyGemError`, because [ActionController::Rescue.rescue_with_handler](https://github.com/rails/rails/blob/master/actionpack/lib/action_controller/metal/rescue.rb#L10) grabs `cause`, which is auto-set as of Ruby 2.1
### System configuration

**Rails version**: 5.0.0.beta3

**Ruby version**: 2.3.0

