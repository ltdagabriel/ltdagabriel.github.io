---
title: Association not getting saved correctly
labels: activerecord
layout: issue
---

If you have a model with a has_many association and that other model has an association set to a model instance and you update it by setting the foreign key to something else, it will become unset when the original model is saved.
This occurs in 3.2.8 and the 3-2-stable branch.

Probably make more sense with an example:

```
rails new has_many_bug
cd has_many_bug
bundle exec rails g model user
bundle exec rails g model author
bundle exec rails g model book user:references author:references
#Edit config/application.rb and comment out following line
config.active_record.whitelist_attributes
```

Models:

```
class Author < ActiveRecord::Base
  has_many :books
end
class Book < ActiveRecord::Base
  belongs_to :user
  belongs_to :author
end
class User < ActiveRecord::Base
  has_many :books
end
```

test.rb:

```
a1 = Author.create
a2 = Author.create
u=User.new
b1 = Book.new(:author=>a1)
b1.attributes = {:author_id => a2.id}
u.books = [b1]
puts "a1.id = #{a1.id}"
puts "a2.id = #{a2.id}"
puts "b1.author_id before save = #{b1.author_id}"
#Uncomment the following line and it will work
#puts "b1.author = #{b1.author}"
u.save
puts "b1.author_id after save = #{b1.author_id}"
```

Results in:

```
irb(main):001:0> load 'test.rb'
a1.id = 43
a2.id = 44
b1.author_id before save = 44
b1.author_id after save = 43
```

