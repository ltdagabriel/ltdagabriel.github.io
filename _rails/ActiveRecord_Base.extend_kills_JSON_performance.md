---
title: ActiveRecord::Base.extend kills JSON performance
labels: activerecord
layout: issue
---

We have a large Rails app, and our JSON performance is abysmal. We've verified JSON.parser is using the C implementation and not the Ruby implementation. We've tried YAJL and OJ to no avail. When we test these things outside of Rails everything's really fast. But running the same tests from the Rails console tells another story.

Today I narrowed this down to authlogic (https://github.com/binarylogic/authlogic/issues/344), but a bit of further tinkering reveals the problem may be in active_record.

Here's my Gemfile:

```
source :rubygems
gem 'json'
gem 'activerecord', '>=3.0.0', :require => 'active_record'
```

And here's my test:

``` ruby
#!/usr/bin/env ruby

require 'rubygems'
require 'bundler'

Bundler.require(:default)

require 'benchmark'
require 'json'

def profile
  blob = File.read(File.join('big_file.json'))
  time = Benchmark.realtime do
    JSON.parse(JSON.parse(blob).to_json).to_json
  end
  time * 1000
end

NUM = 10

puts NUM.times.map { profile }.reduce(:+)/NUM.to_f

module Foo
  ActiveRecord::Base.extend(Foo)
end

puts NUM.times.map { profile }.reduce(:+)/NUM.to_f
```

On my machine the output of bundle-exec'ing that test is as follows:

```
50.8620023727417
790.248107910156
```

Crazypants, right? That little innocuous `Foo` module kills JSON performance. Anyone else seeing this kind of problem? What the freakazoid is going on?

