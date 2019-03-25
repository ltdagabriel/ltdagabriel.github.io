---
title: #as_json options seem to stick around when rendering hash as JSON
labels: activesupport
layout: issue
---

Hey there,

I think there might be a problem when rendering a hash as json that includes an object which implements the #as_json method.

The following spec fails:

``` ruby
require "active_support/all"
require "rspec"

class Foo
  attr_accessor :foo, :bar

  def as_json(options={})
    options[:only] = %w(foo bar)
    super(options)
  end
end

describe "#to_json" do
  it "should render an object with as_json and a hash with all of its attributes" do
    f = Foo.new
    f.foo = "hello"
    f.bar = "world"

    hash = {"foo" => f, "other_hash" => {"foo" => "other_foo", "test" => "other_test"}}
    JSON.parse(hash.to_json).should == {"foo" => {"foo" => "hello", "bar" => "world"}, "other_hash" => {"foo" => "other_foo", "test" => "other_test"}}
  end
end
```

However it works when the Foo instance is rendered _after_ the hash:

``` ruby
describe "#to_json" do
  it "should render an object with as_json and a hash with all of its attributes" do
    f = Foo.new
    f.foo = "hello"
    f.bar = "world"

    hash = {"other_hash" => {"foo" => "other_foo", "test" => "other_test"}, "foo" => f}
    JSON.parse(hash.to_json).should == {"foo" => {"foo" => "hello", "bar" => "world"}, "other_hash" => {"foo" => "other_foo", "test" => "other_test"}}
  end
end
```

What do you guys think?

Best,
Manuel

