---
title: Counter cache doesn't use cache when classname can't be pluralized
labels: activerecord
layout: issue
---

``` ruby
class Classroom < ActiveRecord::Base
  has_many :classroomship, :dependent => :destroy
end

class Classroomship < ActiveRecord::Base
  set_table_name 'classrooms_parentum'
  belongs_to :classroom, :counter_cache => :classrooms_parentum_count
end

class AddClassroomsParentumCountToClassroom < ActiveRecord::Migration
  def self.up
    add_column :classrooms, :classrooms_parentum_count, :integer, :default => 0
  end
end

classroom = Classroom.last
classroom.classroomship.size
 ->  (0.5ms)  SELECT COUNT(*) FROM `classrooms_parentum` WHERE `classrooms_parentum`.`classroom_id` = 109
 => 6 
```

But when I add new classroomship classrooms_parentum_count will be updated

``` ruby
classroom.classroomship.create(:parentis => Parentis.first)
-> SQL (0.2ms)  UPDATE `classrooms` SET `classrooms_parentum_count` = COALESCE(`classrooms_parentum_count`, 0) + 1 WHERE `classrooms`.`id` = 109
```

Rails 3.1.3

