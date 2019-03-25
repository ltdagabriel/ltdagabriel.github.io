---
title: Wrong inferred name for a HABTM auxiliar table inside a schema
labels: activerecord
layout: issue
---

In PgSQL, when two models in a schema are associated through a has_and_belongs_to_many association, the name infered for the auxiliar table is wrong.

For instance:

``` ruby
class Music::Song < ActiveRecord::Base
  self.table_name = "music.songs"
  has_and_belongs_to_many :albums
end

class Music::Album < ActiveRecord::Base
  self.table_name = "music.albums"
  has_and_belongs_to_many :songs
end
```

``` ruby
Music::Song.includes(:albums).first
```

``` sql
SELECT DISTINCT "music"."songs"."id", "music"."songs"."id" AS alias_0
FROM "music"."songs"
  LEFT OUTER JOIN "music"."albums_music" ON "music"."albums_music"."song_id" = "music"."songs"."id"
  LEFT OUTER JOIN "music"."albums" ON "music"."albums"."id" = "music"."albums_music"."album_id"
ORDER BY "music"."songs"."id" ASC
LIMIT 1
```

Here **"music"."albums_music"** should have been **"music"."albums_songs"**, but somehow ActiveRecord is using the name of the first table plus the name schema.

It can be fixed adding **join_table: "music.albums_songs"** in the models, but I'm guessing it shouldn't be needed.

