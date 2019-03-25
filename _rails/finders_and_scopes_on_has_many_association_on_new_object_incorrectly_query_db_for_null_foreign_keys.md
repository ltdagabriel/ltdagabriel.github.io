---
title: finders and scopes on has_many association on new object incorrectly query db for null foreign keys
labels: activerecord
layout: issue
---

Rails version 3.2.1

Consider a new, unsaved (such that it has no id yet), instance of a model with a has_many association. Finders and scopes on the has_many association of this object behave incorrectly. They issue db queries with null for the foreign key. These queries return incorrect results if the foreign key is allowed to be null, because it will match all records with null values for that key.

For example, consider a School model:

``` ruby
class School < ActiveRecord::Base
  has_many :students
end
```

Creating a new, unsaved, instance of a school and accessing the students association correctly returns an empty array:

``` irb
ruby-1.9.2-p290 :009 > s = School.new
 => #<School id: nil, name: nil, created_at: nil, updated_at: nil> 
ruby-1.9.2-p290 :010 > s.students
 => [] 
```

However, adding a dynamic finder on the association incorrectly matches student records with null school_id foreign keys:

``` irb
ruby-1.9.2-p290 :011 > s.students.find_by_name("Aaron Aardvark")
  Student Load (0.4ms)  SELECT `students`.* FROM `students` WHERE `students`.`school_id` IS NULL AND `students`.`name` = 'Aaron Aardvark' LIMIT 1
 => #<Student id: 1, name: "Aaron Aardvark", school_id: nil, created_at: "2012-02-29 02:08:37", updated_at: "2012-02-29 02:08:37"> 
```

count, exists?, and other methods behave similarly incorrectly:

``` irb
ruby-1.9.2-p290 :012 > s.students.count
   (0.3ms)  SELECT COUNT(*) FROM `students` WHERE `students`.`school_id` IS NULL
 => 2 
ruby-1.9.2-p290 :013 > s.students.exists?(Student.last)
  Student Load (0.3ms)  SELECT `students`.* FROM `students` ORDER BY `students`.`id` DESC LIMIT 1
  Student Exists (0.3ms)  SELECT 1 FROM `students` WHERE `students`.`school_id` IS NULL AND `students`.`id` = 2 LIMIT 1
 => true 
```

Scopes exhibit similarly bad behavior. Suppose Student has the following scope:

``` ruby
  scope :starts_with, lambda { |prefix| where(['LOWER(name) LIKE ?', "#{prefix}%"])}
```

Accessing that scope on the association on a new, unsaved, school object gives this:

``` irb
ruby-1.9.2-p290 :014 > s.students.starts_with("a")
  Student Load (0.4ms)  SELECT `students`.* FROM `students` WHERE `students`.`school_id` IS NULL AND (LOWER(name) LIKE 'a%')
 => [#<Student id: 1, name: "Aaron Aardvark", school_id: nil, created_at: "2012-02-29 02:08:37", updated_at: "2012-02-29 02:08:37">] 
```

The correct behavior should probably be to return an empty array for the finders and scopes, 0 for the count, and false for exists?. However, throwing an exception would be fine with me as well.

