---
title: Update counter cache when doing collection<<(object, …)
labels: activerecord
layout: issue
---

Hi I'm having trouble with a simple counter cache in rails. I have the following models:

``` ruby
class CarImage < ActiveRecord::Base
  belongs_to :car, :counter_cache => :images_count
end

class Car < ActiveRecord::Base
  has_many :images, :class_name => "CarImage", :dependent => :destroy, :limit => 4
end
```

The problem occurs when doing this:

``` ruby
car1.images << car2.images
```

None of the images_count on the two cars are being updated accordingly.

I found this on the topic: http://stackoverflow.com/questions/5758339/how-to-update-counter-cache-when-updating-a-model And I my case the solution would look something like this:

``` ruby
class Car < ActiveRecord::Base
  has_many :images, :class_name => "CarImage", :dependent => :destroy, :limit => 4
  after_save :update_counter, :if => :car_id_changed?

  private

  def update_counter
    new_car = Car.find(car_id)
    Car.increment_counter(:images_count, new_car.id)
    if car_id_was.present?
      old_car = Car.find(car_id_was)
      Car.decrement_counter(:images_count, old_car.id)
    end
  end

end
```

But - I'm asking myself - Why is this not build into rails at first hand? I can't find anything in the documentation about the issue, and to me using the build-in counter_cache in rails is almost unusable, if its really true, that it only supports create and destroy - not update! Can anyone give a good explanation as to why this is? Is it really necessary for me to build a callback and keep an eye on the relations my self?

BTW. I'm using 3.1

