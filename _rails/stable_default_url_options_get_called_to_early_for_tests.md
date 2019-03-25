---
title: [3-1-stable] default_url_options get called to early for tests
labels: regression
layout: issue
---

Hi!

I believe, this is a regression from 3-0-stable, but maybe things are just different now. I have the following code:

```
Testit::Application.routes.draw do
  scope "/:locale", :constraints => { :locale => /[a-z]{2,3}/ } do
    get "c1" => "c1#index"
    get "c2" => "c2#index"
  end
end

class ApplicationController < ActionController::Base
  protect_from_forgery

  before_filter do
    logger.info("setting I18n.locale to #{params[:locale].inspect}")
    I18n.locale = params[:locale]
  end

  private
  def default_url_options(options={})
    logger.info("default_url_options(#{options.inspect})")
    options = {"locale" => I18n.locale}.merge(options)
  end
end

class C2Controller < ApplicationController
  def index
    redirect_to :controller => "c1", :action => "index"
  end
end

require 'test_helper'
class C2ControllerTest < ActionController::TestCase
  test "should get index" do
    get :index, :locale => "de"
    assert_redirected_to "/de/c1"
  end
end
```

If I run that test, it fails, because it redirects to /en/c1. But if I run it in development on the webserver, it works as expected. Looks like default_url_options get called to early:

Test log:

```
default_url_options({}) # <-- before the before filter!
  Processing by C2Controller#index as HTML
  Parameters: {"locale"=>"de"}
setting I18n.locale to "de"
Redirected to http://test.host/en/c1
Completed 302 Found in 1ms
```

Development log:

```
Started GET "/de/c2" for 127.0.0.1 at 2011-06-27 23:43:37 +0200
  Processing by C2Controller#index as HTML
  Parameters: {"locale"=>"de"}
setting I18n.locale to "de"
default_url_options({}) # <-- After the before_filter
Redirected to http://localhost:3000/de/c1
Completed 302 Found in 1m
```

Why is that? With 3-0-stable, the test works as expected.

