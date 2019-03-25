---
title: :belongs_to, :dependent => destroy doesn`t work correctly.
labels: activerecord, attached PR
layout: issue
---

This bug appears again: https://rails.lighthouseapp.com/projects/8994/tickets/1079

Citation:
:belongs_to :dependent => :destroy leaves the model open to foreign key constraint failure upon deletion. This seems be due to it using before_destroy as opposed to after_destroy. It can't destroy the associated model before it deletes itself because of the foreign key. I believe the fix is to simply use after_destroy (patch attached) to destroy :belongs_to associations after it's destroyed itself.

Example:

class Person < ActiveRecord::Base
  belongs_to :person_address, :dependent => :destroy
end

class PersonAddress < ActiveRecord::Base
  has_one :person
end
...and a foreign key on person_address_id on the person table to id on the person_address table.

