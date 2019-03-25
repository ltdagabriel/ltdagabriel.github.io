---
title: Overriding find_by_* methods causes error
labels: activerecord, attached PR
layout: issue
---

I'm currently working on upgrading an app from 3.2.18 to 4.0.4 (and eventually 4.1.X).  We ran across an interesting bug, but I'm not sure if it is a bug, or simply something to be aware of when upgrading.

Background:
We have an AR model that has a column named mac_address.  We have created a class method that normalizes the data before searching for the record.

``` ruby
class Device
  def self.find_by_mac_address(address)
    super(MacAddress.new(address).normalized)
  end
end
```

The `MacAddress.normalized` method simply converts the address to a standard format:

```
MacAddress.new('ABCDEF').normalized     # => abcdef
MacAddress.new('AB:CD:EF').normalized   # => abcdef
MacAddress.new('ab cd ef').normalized   # => abcdef
```

Issue:
In Rails 3.2.18, this worked fine (same command ran twice):

```
Device.find_by_mac_address('ab cd ef')  # Finds the device with address abcdef
Device.find_by_mac_address('ab cd ef')  # Finds the device with address abcdef
```

In Rails 4.0.4, this breaks:

```
Device.find_by_mac_address('ab cd ef')  # Finds the device with address abcdef
Device.find_by_mac_address('ab cd ef')  # nil (it no longer normalizes the address)
```

It appears the problem is with `activerecord/lib/active_record/dynamic_matchers.rb` line 63.  This code is called by the `method_missing` logic in this file.  

I'm guessing the issue is that lines 63-69 defines the "missing" method on the class it was called on.  i.e. our `Device#find_by_mac_address` method is over written once we call `super`.

Further debugging (suggested offline by @cschneid):

``` ruby
>> m1 = Device.method(:find_by_mac_address)
>> Device.find_by_mac_address("ab cd ef")
>> m2 = Device.method(:find_by_mac_address)
>> Device.find_by_mac_address("ab cd ef")
>> puts m1.source_location
app/models/device.rb
1121
=> nil
>> puts m2.source_location
/usr/local/rvm/gems/ruby-2.1.2@rails4.0/gems/activerecord-4.0.4/lib/active_record/dynamic_matchers.rb
65
=> nil
>>
```

Workaround (suggested by @diminish7):

For anyone who runs into this issue, we're currently using a workaround:

``` ruby
def self.find_by_mac_address(address)
    where(mac_address: MacAddress.new(address).normalized).first
end
```

So our question is, is this expected behavior?  Is there a better way to do what we're trying to do?

