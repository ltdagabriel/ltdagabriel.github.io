---
title: calling save in after_commit(on: :create) block triggers same block again
labels: activerecord, stale
layout: issue
---

Duplicate of https://github.com/rails/rails/issues/6207 which was fixed quite a while ago. I searched over the history of activerecord and wasn't able to find when this issue re-surfaced. It was originally fixed by https://github.com/rails/rails/pull/6226

This did not occur in rails 5.0.x.

### Steps to reproduce

You can use the test in #6226 to recreate. Add this to `activerecord/test/cases/transaction_callbacks_test.rb`:

```class SaveFromAfterCommitBlockTest < ActiveRecord::TestCase
  self.use_transactional_tests = false

  class TopicWithSaveInCallback < ActiveRecord::Base
    self.table_name = :topics
    after_commit :cache_topic, on: :create
    after_commit :call_update, on: :update
    attr_accessor :cached, :record_updated

    def call_update
      self.record_updated = true
    end

    def cache_topic
      unless cached
        self.cached = true
        self.save
      else
        self.cached = false
      end
    end
  end

  def test_after_commit_in_save
    topic = TopicWithSaveInCallback.new
    topic.save
    assert_equal true, topic.cached
    assert_equal true, topic.record_updated
  end
end
```

### Expected behavior

The `after_commit on: :create` shouldn't be called twice.

### Actual behavior
The `after_commit on: :create` is called twice.

### System configuration
**Rails version**: 5.1.4

**Ruby version**: ruby 2.4.1p111

