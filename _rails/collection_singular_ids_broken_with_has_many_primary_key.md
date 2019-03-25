---
title: collection_singular_ids broken with has_many primary_key
labels: activerecord, attached PR
layout: issue
---

The `:primary_key` option in a has_many relationship is referring to the column to be used as a key for the defining model, but `#collection_singular_ids` tries to use it as the ID column of the associated model.

Note: Although I'm using 3.2.17, from looking at the code in master I believe this bug still exists in Rails 4.
### Example Models

``` ruby
class User < ActiveRecord::Base
    # :id => :integer, :primary
    # :uuid => :string

    has_many :games, :foreign_key => :player_uuid, :primary_key => :uuid
end
```

``` ruby
class Game < ActiveRecord::Base
    # :id => :integer, :primary
    # :player_uuid => :string

    belongs_to :player, :foreign_key => :player_uuid, :primary_key => :uuid
end
```
### Output

```
> u = Users.first
> u.games_ids
NoMethodError: undefined method `uuid' for #<Game:0x007fcf01e38e38>
    from .../gems/activemodel-3.2.17/lib/active_model/attribute_methods.rb:407:in `method_missing'
    from .../gems/activerecord-3.2.17/lib/active_record/attribute_methods.rb:149:in `method_missing'
    from .../gems/activerecord-3.2.17/lib/active_record/associations/collection_association.rb:48:in `block in ids_reader'
    from .../gems/activerecord-3.2.17/lib/active_record/associations/collection_association.rb:47:in `map'
    from .../gems/activerecord-3.2.17/lib/active_record/associations/collection_association.rb:47:in `ids_reader'
    from .../gems/activerecord-3.2.17/lib/active_record/associations/builder/collection_association.rb:62:in `block in define_readers'
    from (irb):3
```

