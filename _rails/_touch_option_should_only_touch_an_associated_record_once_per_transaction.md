---
title: `:touch` option should only touch an associated record once per transaction
labels: activerecord
layout: issue
---

Consider these two models:

``` ruby
class Post < ActiveRecord::Base
  has_many :assets
end

class Asset < ActiveRecord::Base
  belongs_to :post, touch: true
end
```

If I go into a post and add, for example, 20 assets, this results in _40_ extra queries to the database - 20 to select the associated Post, and 20 to "touch" the associated Post. Is this the desired behavior?

I think it's especially important to consider this now that the Rails framework is really advocating the use of the `:touch` with cache digests.

A shortened example from the logs: You can see how this could get ridiculous.

```
SQL (0.3ms)  INSERT INTO `assets` (`post_id`, `caption`) VALUES (35401, 'Asset #1')
Post Load (0.3ms)  SELECT `posts`.* FROM `posts` WHERE `posts`.`id` = 35401 LIMIT 1
SQL (0.3ms)  UPDATE `posts` SET `updated_at` = '2013-01-04 12:00:36' WHERE `posts`.`id` = 35401

SQL (0.4ms)  INSERT INTO `assets` (`post_id`, `caption`) VALUES (35401, 'Asset #2')
Post Load (0.4ms)  SELECT `posts`.* FROM `posts` WHERE `posts`.`id` = 35401 LIMIT 1
SQL (0.3ms)  UPDATE `posts` SET `updated_at` = '2013-01-04 12:00:36' WHERE `posts`.`id` = 35401

SQL (0.3ms)  INSERT INTO `assets` (`post_id`, `caption`) VALUES (35401, 'Asset #3')
Post Load (0.3ms)  SELECT `posts`.* FROM `posts` WHERE `posts`.`id` = 35401 LIMIT 1
SQL (0.3ms)  UPDATE `posts` SET `updated_at` = '2013-01-04 12:00:36' WHERE `posts`.`id` = 35401

SQL (0.4ms)  INSERT INTO `assets` (`post_id`, `caption`) VALUES (35401, 'Asset #4')
Post Load (0.4ms)  SELECT `posts`.* FROM `posts` WHERE `posts`.`id` = 35401 LIMIT 1
SQL (8.0ms)  UPDATE `posts` SET `updated_at` = '2013-01-04 12:00:36' WHERE `posts`.`id` = 35401

SQL (1.8ms)  INSERT INTO `assets` (`post_id`, `caption`) VALUES (35401, 'Asset #5')
Post Load (0.5ms)  SELECT `posts`.* FROM `posts` WHERE `posts`.`id` = 35401 LIMIT 1
SQL (0.4ms)  UPDATE `posts` SET `updated_at` = '2013-01-04 12:00:36' WHERE `posts`.`id` = 35401
```

To get around this, I've removed all `:touch` options and added a very simple callback which utilizes the somewhat-odd behavior that a model's callbacks get run even if the record isn't actually going to be updated:

``` ruby
class Post < ActiveRecord::Base
  has_many :assets
  after_save -> { self.touch }
end

class Asset < ActiveRecord::Base
  belongs_to :post
end
```

This ensures that the record will be updated no matter what, which is fine for my purposes, but feels like a hack. It also has the incidental benefit that anybody can manually expire a cache (i.e., bump the timestamp) by just saving the record (instead of having to add a hidden space somewhere to force the record's timestamp to update). 

It results in a much cleaner log, with only ONE extra query, no matter how many assets you are saving:

```
SQL (0.4ms)  INSERT INTO `assets` (`post_id`, `caption`) VALUES (35401, "Asset #1")
SQL (0.4ms)  INSERT INTO `assets` (`post_id`, `caption`) VALUES (35401, "Asset #2")
SQL (0.4ms)  INSERT INTO `assets` (`post_id`, `caption`) VALUES (35401, "Asset #3")
SQL (0.4ms)  INSERT INTO `assets` (`post_id`, `caption`) VALUES (35401, "Asset #4")
SQL (0.4ms)  INSERT INTO `assets` (`post_id`, `caption`) VALUES (35401, "Asset #5")
SQL (0.3ms)  UPDATE `posts` SET `updated_at` = '2013-01-04 12:34:38' WHERE `posts`.`id` = 35401
```

So I guess the real issue is all those extra queries that get generated when using the `touch` option on `belongs_to` associations. It seems like it shouldn't be that way, but I'm not sure.

Thanks.

