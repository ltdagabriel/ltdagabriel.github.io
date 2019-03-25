---
title: Nested eager loading on polymorphic association
labels: activerecord
layout: issue
---

The current implementation of the preloader prevent  you from eager loading inexistent association.

[preloader.rb#L144](https://github.com/rails/rails/blob/master/activerecord/lib/active_record/associations/preloader.rb#L144)

``` ruby
def records_by_reflection(association)
  records.group_by do |record|
    reflection = record.class.reflections[association]

    unless reflection || record.class.reflections[association].options[:polymorphic]
      raise ActiveRecord::ConfigurationError, "Association named '#{association}' was not found; " \
                                              "perhaps you misspelled it?"
    end

    reflection
  end
end
```

Which seem reasonable but then it as the side effect of preventing nested eager loading on certain type of polymorphic association. Keep reading!

_Here an exemple involving space exploration and experimentation on animals._

``` ruby
class Vehicule < ActiveRecord::Base
  belongs_to :pilot, :polymorphic => true
end

class Astronaut < ActiveRecord::Base
  has_one :rank
  belongs_to :vehicule
end

class Rank < ActiveRecord::Base
  belongs_to :astronaut
end

class Animal < ActiveRecord::Base
  belongs_to :vehicule
end

buzz = Astronaut.create(:name => 'Buzz Aldrin')
Rank.create(:name => 'Colonel', :astronaut => buzz)

laika = Animal.create(:name => 'Laika')

Vehicule.create(:name => 'Lunar module', :pilot => buzz)
Vehicule.create(:name => 'Sputnik 2', :pilot => laika)

Vehicule.all :include => {:pilot => :rank} # Boom. 
> "Association named 'Rank' was not found; perhaps you misspelled it?"
```

As you can see, ActiveRecord seem concern that you try to retrieve the army rank of an animal.

This is sad because as a side effect, it prevent you from eager loading the legit rank association of humanoid astronaut.

Given that polymorphic association can point to any model, records that don't have the association could be simply ignored since there is no warranty that the association is not valid for the other records.

I suppose this also apply to STI.

I would suggest be to simply remove that check, filter out records with missing association like [this](https://github.com/unixcharles/rails/commit/ea22076962eee4d6f233950a4745b4534ee02bae) and leave it up to the programmer to not eager load fantasy associations.

Please advice, thanks for your time! :smile: 

