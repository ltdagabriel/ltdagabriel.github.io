---
title: ActionMailer tests no longer clear deliveries before test execution
labels: actionmailer, attached PR
layout: issue
---

After upgrading to 4.2.x, I'm noticing that I'm getting intermittent test failures with [this change](https://github.com/rails/rails/commit/c4f4123ef45463a09b36186047dbdc82f933fe46) because the deliveries array isn't cleared out **prior** to tests running.  I had written quite a few tests that asserted that the deliveries array is `empty?` since the [guides](http://guides.rubyonrails.org/testing.html) and other docs say that the actionmailer tests are reset automatically.  (Although, combing through the docs now, it doesn't seem extremely clear that it states _when_ they're reset...)

It seems surprising to me that more people haven't run into test failures here, since if you turn on randomized test ordering the following sequence is a definite possibility:
1. A controller test adds mail to the deliveries array
2. The next test that runs is in a mailer test, asserts `ActionMailer::Base.deliveries.empty?`
3. Failure because deliveries is not cleared in initialization anymore

Is this the intended behavior?  I've had to add a `setup` block that simply clears out the email deliveries, but it feels dirty :cry:  

One other thing to mention: the example provided in the rails guides could now result in a false positive (test passing when it should have failed), since the deliveries array may not actually be empty.

example from rails guides:

``` ruby
require 'test_helper'

class UserMailerTest < ActionMailer::TestCase
  test "invite" do
    # Send the email, then test that it got queued
    email = UserMailer.create_invite('me@example.com',
                                     'friend@example.com', Time.now).deliver_now
    assert_not ActionMailer::Base.deliveries.empty?

    # Test the body of the sent email contains what we expect it to
    assert_equal ['me@example.com'], email.from
    assert_equal ['friend@example.com'], email.to
    assert_equal 'You have been invited by me@example.com', email.subject
    assert_equal read_fixture('invite').join, email.body.to_s
  end
end
```

