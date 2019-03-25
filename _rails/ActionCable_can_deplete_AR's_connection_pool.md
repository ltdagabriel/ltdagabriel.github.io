---
title: ActionCable can deplete AR's connection pool
labels: actioncable, activerecord, attached PR
layout: issue
---

Normally ActionCable::ServerWorker::ActiveRecordConnectionManagement takes care to ensure connections are checked back into the pool. This is not ensured when using ActiveRecord from within a ActionCable::Channel::Streams stream_form/stream_for callback.

Observed this behaviour in rails 5.0.0.beta2.

Example:

```
class MyChannel < ApplicationCable::Channel
  def subscribed
    queue = "my_channels_queue"
    stream_from queue, -> (message) do
      # open a db connection, this will not be returned to the pool
      ActiveRecord::Base.connection
      transmit ActiveSupport::JSON.decode(message), via: queue
    end
  end
end
```

