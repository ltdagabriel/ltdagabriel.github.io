---
title: Serialized attributes always get marked as changed by ActiveModel::Dirty in new record
labels: activerecord, attached PR
layout: issue
---

Pretend you have a simple model like this in a Rails 4 app:

``` ruby
# app/models/user.rb
#
# == Schema Information
#
# Table name: users
#
#  id       :integer          not null, primary key
#  name     :text
#
class User < ActiveRecord::Base
  serialize :name
end
```

Oddly enough, if you instantiate a new instance of the class, the attribute gets marked as if it has changed, regardless of whether any value has been assigned:

```
# Rails 4 console
> u = User.new
=> #<User id: nil, name: nil>
> u.changes
=> {"name"=>[nil, nil]}
```

This behavior has changed from what it was in Rails 3

```
# Rails 3 console
> u = User.new
=> #<User id: nil, name: nil>
> u.changes
=> {}
```

I got alerted to this issue by airblade/paper_trail#266 by the way.

