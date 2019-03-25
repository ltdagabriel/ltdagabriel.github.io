---
title: Using Pluck with a  new record and a has_many relationship giving unexpected result.
labels: activerecord
layout: issue
---

Not sure if this is intended or not, but I ran into the following result when working with <tt>pluck</tt> and a newly instantiated record. (Tested in Rails 3.2.8 and 3.2.9.rc2 against mysql2 0.3.11)

Setup

``` ruby
# person.rb
has_many :pets
```

``` ruby
# pet.rb
belongs_to :person
```

Using pluck to get associated ids with a new record.

``` ruby
@person = Person.new
# => #<Person id: nil, created_at: nil, updated_at: nil> 
@person.pets.pluck(:id)
# Expected
# => []
# Actual Result
# SELECT id FROM `pets` WHERE `pets`.`person_id` IS NULL
# => [1,2,3,4,5,6,...] ids of all pets that have person_id set to nil
```

I expected to see the empty array [] since leaving <tt>.pluck(:id)</tt> off would return an empty ActiveRecord relationship

``` ruby
@person = Person.new
@person.pets
# => []
```

While I can check explicitly for <tt>new_record?</tt> and solve my problem that way (as it works correctly with saved records), it seems that the expected result doesn't match.

I understand what <tt>pluck</tt> is doing in building the relationship and why it's retrieving associated records, however I'd like to know if anyone has further insight on whether <tt>pluck</tt> is intended to work with new records and relationships like this?

Thanks!

