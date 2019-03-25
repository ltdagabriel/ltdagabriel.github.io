---
title: Add test_with_transaction to easily test transaction callbacks etc
labels: activerecord
layout: issue
---

TIL that you can actually easily transaction callbacks like after_commit, but it's a bit cumbersome. This is what you have to do today:

``` ruby
  uses_transaction :test_completing_todo_will_cause_a_chat_relay
  test 'completing todo will cause a chat relay' do
    recordings(:design_todo).complete
    assert last_relayed_recordable(:anniversary).completed?
  end
```

I'd like to expose this as a more user-friendly and documented feature:

``` ruby
  test_with_transaction 'completing todo will cause a chat relay' do
    recordings(:design_todo).complete
    assert last_relayed_recordable(:anniversary).completed?
  end
```

