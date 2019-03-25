---
title: nested_attributes _destroy does not work with validates length => { :minimum => 1 }
labels: activerecord, stale
layout: issue
---

I am not able to validate on length of has_many association updated through nested_attributes.

It works with "save" but does not work with update_attributes with _destroy.

The code below ilustrates the issue.

``` ruby
ActiveRecord::Migration.create_table :projects do |t|
  t.string :name
end
ActiveRecord::Migration.create_table :milestones do |t|
  t.string :name
  t.references :project, :null => false
end


class Project < ActiveRecord::Base
  has_many :milestones
  accepts_nested_attributes_for :milestones, :allow_destroy => true
  validates :milestones, :length => { :minimum => 1 }
end

class Milestone < ActiveRecord::Base
  belongs_to :project
end

p = Project.create!(:name => "Project", :milestones_attributes => [{ :name => "M1" }])
m = p.milestones.first
p.update_attributes(:milestones_attributes => [{ :name => m.name, :id => m.id, :_destroy => 1 }])
p.errors[:milestones] # => []  ... I expected it to be ["is too short (minimum is 1 characters)"] 
p.save
p.errors[:milestones] #  => ["is too short (minimum is 1 characters)"] 
Rails.version # => "3.1.3"
```

