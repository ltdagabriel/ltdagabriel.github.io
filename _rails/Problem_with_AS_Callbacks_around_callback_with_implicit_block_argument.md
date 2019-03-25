---
title: Problem with AS::Callbacks around callback with implicit block argument
labels: docs
layout: issue
---

I have some around filters with an implicit block argument as described in the [AS::Callbacks docs for around filters](https://github.com/rails/rails/blob/master/activesupport/lib/active_support/callbacks.rb#L576), that used to work on rails-4.0.3/ruby-2.1.1.  It broke when I tried upgrading to rails-4.1.4/ruby-2.1.2

I'm not sure if this is just a bug against current documentation, or documented in release notes somewhere, but after some digging, I discovered that changing my implicit block arg to an explicit one fixed the problem, as shown below.  One would think this would break a lot of existing code that followed the docs...?

```
require 'active_support/callbacks'

class Base
  include ActiveSupport::Callbacks
  define_callbacks :foo

  def foo
    run_callbacks(:foo) do
      puts 'foo'
    end
  end
end

class Old < Base
  set_callback :foo, :around do |obj, &block|
    puts 'around implicit block'
    p obj
    p block
  end
end

class New < Base
  set_callback :foo, :around do |obj, block|
    puts 'around explicit block'
    p obj
    p block
  end
end

Old.new.foo
New.new.foo
```

produces:

```
around implicit block
#<Old:0x007fdbdc888730>
nil
around explicit block
#<New:0x007fdbdc888028>
#<Proc:0x007fdbdc87bd28@/Users/mconway/.rvm/gems/ruby-2.1.2/gems/activesupport-4.1.4/lib/active_support/callbacks.rb:328>
```

