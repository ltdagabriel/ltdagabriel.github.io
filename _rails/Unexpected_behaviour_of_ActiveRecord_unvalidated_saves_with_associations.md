---
title: Unexpected behaviour of ActiveRecord unvalidated saves with associations
labels: activerecord
layout: issue
---

I'm not certain that this is a bug as such but I certainly found the behaviour unexpected in two ways.

1) Errors not raised when I would have expected them.
2) valid? has side effects.

I have some tests that show the behaviour which although it is not my expectation that they will actually be pulled into the main project.  See: https://github.com/josephlord/rails/pull/new/unvalidated_association_save_test_for_pull

Essentially the behaviour that I have found is that I get unexpected behaviour in the following scenario.

Steps to reproduce:
1) Assign object to belongs_to association
2) Assign invalid value to the _id of the association
4) Call save(validated: false) - No error is raised.  Record is saved incorrectly

Step 3 is to call valid? on the object which  prevents the issue and causes the ActiveRecord::InvalidForeignKey to be triggered in step 4.

I know that this is an edge case.  I came across it while trying to develop tests to ensure that the database validation was occuring in addition to the Rails validations.  It may also be the behaviour that is expected by those who know Rails better than I do.

This test passes but I think that this behaviour is wrong:

``` ruby
class House < ActiveRecord::Base
  has_many :doors
end

class Door < ActiveRecord::Base
  belongs_to :house
  validates :house, presence: true
end
```
# Foreign key constraints are declared in the schema.  See https://github.com/josephlord/rails/pull/new/unvalidated_association_save_test_for_pull

``` ruby
  def test_save_validate_false_after_association_created_bad_behaviour
    # This passes but I think it shouldn't.  
    # The intention is to illustrate the current behaviour rather than desired behaviour
    door  = Door.new
    houseA = door.house = House.new # This makes the test fail below!!!
    bad_house_id = House.order(:id).last.id + 10000
    house_count = House.count
    door.house_id = bad_house_id
    door.save(validate: false)
    door.reload
    houseA.reload
    assert_not_equal bad_house_id, door.house_id
    assert_equal houseA.id, door.house_id
    assert_raises(ActiveRecord::RecordNotFound) { House.find bad_house_id }
    assert_equal house_count + 1, House.count
  end
```

