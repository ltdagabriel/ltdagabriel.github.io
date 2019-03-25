---
title: Unexpected session sharing with integration tests leads to errors
labels: actionpack, attached PR
layout: issue
---

We're experiencing some weird behavior in an integration test that uses open_session multiple times. I've put together a fresh sample app to and made the code as close to the [integration test examples](http://guides.rubyonrails.org/testing.html#integration-testing-examples) as possible, and I'm still seeing the issue.

``` ruby
class SessionIntegrationTest < ActionDispatch::IntegrationTest
  test 'two session test' do # passes
    mel = login(:melissa)
    luis = login(:luis)

    assert_equal 'Welcome melissa!', mel.flash[:notice]
    assert_equal 'Welcome luis!', luis.flash[:notice]
  end

  test 'three session test' do # fails
    mel = login(:melissa)
    luis = login(:luis)
    frank = login(:frank)

    assert_equal 'Welcome melissa!', mel.flash[:notice]
    assert_equal 'Welcome luis!', luis.flash[:notice]  # <---- fails here with "Welcome frank!"
    assert_equal 'Welcome frank!', frank.flash[:notice]
  end

  private

  def login(name, password: 'password')
    open_session do |sess|
      sess.post sessions_url, username: name, password: password
      assert_equal '/sessions', sess.path
    end
  end
end
```

It seems as though the 2nd session is shared with the 3rd session. Any idea what could be causing this? I've tried digging into the source code for the integration tests but I'm not finding the logic that easy to follow.

cc @dvallance

