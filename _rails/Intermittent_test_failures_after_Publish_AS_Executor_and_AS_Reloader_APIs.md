---
title: Intermittent test failures after `Publish AS::Executor and AS::Reloader APIs`
labels: activesupport
layout: issue
---

Looks like d3c9d80 (according to my bisect) leads to intermittent test failures in my [in-house] app.
Test [rspec + factory_girl] that looks in a nutshell like this:

``` ruby
RSpec.feature 'Foos' do
  let!(:foo) { create(:foo ) }
  context 'My foos' do
    it do
      p Foo.all
      p foo
      p foo.new_record?
      p Foo.all
    end
  end
end
```

sometimes produces output:

```
#<ActiveRecord::Relation []>
#<Foo id: 9, name: …>
false
#<ActiveRecord::Relation []>
```

Unfortunately I'm unable to make reduced testcase, maybe you can point me how to debug this further.
cc @matthewd 

