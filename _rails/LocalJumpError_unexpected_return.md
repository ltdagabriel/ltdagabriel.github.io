---
title: LocalJumpError: unexpected return
labels: activesupport
layout: issue
---

# TL;DR

``` ruby
# This doesn't work anymore (can't use return in callback blocks)

class Model < AR::Base
  before_save do
    return false if some_condition

    # ...more stuff here
  end
end

# Fix 1

class Model < AR::Base
  before_save do
    if some_condition
      false
    else
      # ...more stuff here
    end
  end
end

# Fix 2

class Model < AR::Base
  before_save(&->{
    return false if some_condition

    # ...more stuff here
  })
end

# Fix 3

class Model < AR::Base
  before_save :my_before_save

  def my_before_save
    return false if some_condition

    # ...more stuff here
  end
end
```
# Moar

This is affecting the **master** branch only.

I am upgrading [Discourse](https://github.com/discourse/discourse) to run on master so I can run some benchmarks on it. One error that I encountered when upgrading is this:

``` ruby
     LocalJumpError:
       unexpected return
     # ./app/models/topic.rb:156:in `block in <class:Topic>'
```

...which is caused by code like this:

``` ruby
  after_create do
    return if skip_callbacks

    changed_to_category(category)
    if archetype == Archetype.private_message
      DraftSequence.next!(user, Draft::NEW_PRIVATE_MESSAGE)
    else
      DraftSequence.next!(user, Draft::NEW_TOPIC)
    end
  end
```

...which I fixed it by changing it to...

``` ruby
  after_create do
    unless skip_callbacks
      changed_to_category(category)
      if archetype == Archetype.private_message
        DraftSequence.next!(user, Draft::NEW_PRIVATE_MESSAGE)
      else
        DraftSequence.next!(user, Draft::NEW_TOPIC)
      end
    end
  end
```

Is the return early pattern supported? If so this seems to be a breaking change.

From my initial investigation it looks like this is caused by the changes made to how ActiveSupport callbacks work.

cc @tenderlove @SamSaffron

