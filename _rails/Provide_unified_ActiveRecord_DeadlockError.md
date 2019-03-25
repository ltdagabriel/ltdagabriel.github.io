---
title: Provide unified ActiveRecord::DeadlockError
labels: activerecord
layout: issue
---

I just had to write the following concern for our ApplicationJob class in Basecamp:

``` ruby
# Database deadlock exceptions can take multiple forms that need a closer interrogation of the exception to determine.
# Thus we can't just use the retry_on functionality provided by ActiveJob and we must roll our own variety.
module DatabaseLockingRetry
  extend ActiveSupport::Concern

  included do
    rescue_from ActiveRecord::StatementInvalid, with: :retry_locking_errors
    rescue_from Mysql2::Error, with: :retry_locking_errors
  end

  private
    def retry_locking_errors(exception)
      if locking_error?(exception) && executions < 10
        retry_job(wait: 30.seconds)
      else
        raise error
      end
    end

    def locking_error?(exception)
      exception.message =~ /Deadlock found/ || exception.message =~ /Lock wait timeout/
    end
end
```

That's unreasonable. It should just have been:

``` ruby
class ApplicationJob
  retry_on ActiveRecord::Deadlock, wait: 30.seconds, attempts: 10
end
```

Let's provide a ActiveRecord::Deadlock exception that captures all the ways that is expressed by the underlying adapters and AR itself.

