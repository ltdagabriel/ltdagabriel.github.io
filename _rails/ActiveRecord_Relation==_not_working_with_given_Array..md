---
title: ActiveRecord::Relation#== not working with given Array.
labels: activerecord, attached PR
layout: issue
---

Hi, 

I'm using ruby 2.0.0p353 + Rails 3.2.16 + RSpec 2.14

I have a simple spec for my controller to check the value of the assigned instance variable. 

It fails.

``` ruby
require 'spec_helper'

describe GroupsController, focused: true do
  render_views

  let(:user)           { create :user, :super_admin }
  let!(:project)       { create :project }
  let(:groups)         { project.groups }

  before { sign_in user }

  describe '#GET index' do
    subject { get :index, { project_id: project.id } }

    it 'should assign @groups with the related groups' do
      subject
      expect(assigns(:groups)).to eq groups
    end
  end
end
```

I'm comparing `assigns(:groups)` (that returns an ActiveRecord::Relation object) with (`groups` that returns an `Array` object) and the RSpec matcher `eq` is using the following `ActiveRecord::Relation#==`

``` ruby
# File activerecord/lib/active_record/relation.rb, line 539
def ==(other)
  case other
  when Relation
    other.to_sql == to_sql
  when Array
    to_a == other
  end
end
```

I don't know why but it doesn't go in any of the condition of the case method. So I tried:

``` ruby
def ==(other)
  case other
  when Relation
    other.to_sql == to_sql
  when Array
    to_a == other
  else
    puts "\nself class: #{self.class} / other class: #{other.class.name}"
    true
  end
end
```

which outputs:

`self class: ActiveRecord::Relation / other class: Array`

The following changes are making what I want from this method:

``` ruby
def ==(other)
  if other.class == Relation
    other.to_sql == to_sql
  elsif other.class == Array
    to_a == other
  end
end
```

Do you think it could come from the `case` method?

This little code is working properly:

``` ruby
def test_for_case_method(other)
  case other
  when Hash
    puts 'foo'
  when Array
    puts 'bar'
  else
    puts 'zone'
  end
end

obj = Object.new.send(:test_for_case_method, [])
```

