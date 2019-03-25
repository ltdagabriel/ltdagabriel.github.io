---
title: Unexpected behavior when plucking from joins (nil colunms in resulting arrays)
labels: activerecord, attached PR
layout: issue
---

When plucking from a join using SQL fragments, the pluck method will mess with any fields that have the same name but are in different tables, unless you set an SQL alias for one of them.

``` ruby
2.1.1 :001 > Person.joins(:pets).where("pets.species = ?", "Cat").order("people.name ASC, pets.name ASC").pluck("people.name", "pets.name as pet_name")
   (1.1ms)  SELECT people.name, pets.name as pet_name FROM "people" INNER JOIN "pets" ON "pets"."person_id" = "people"."id" WHERE (pets.species = 'Cat')  ORDER BY people.name ASC, pets.name ASC
 => [["Peter", "Garfield"], ["Sally", "Juliet"], ["Sally", "Romeo"]] 
2.1.1 :002 > Person.joins(:pets).where("pets.species = ?", "Cat").order("people.name ASC, pets.name ASC").pluck("people.name", "pets.name")
   (0.5ms)  SELECT people.name, pets.name FROM "people" INNER JOIN "pets" ON "pets"."person_id" = "people"."id" WHERE (pets.species = 'Cat')  ORDER BY people.name ASC, pets.name ASC
 => [["Garfield", nil], ["Juliet", nil], ["Romeo", nil]] 
```

Worth noting that the generated SQL itself is fine, and returns the expected result when executed in SQLite console:

``` SQL
sqlite> SELECT people.name, pets.name FROM "people" INNER JOIN "pets" ON "pets"."person_id" = "people"."id" WHERE (pets.species = 'Cat')  ORDER BY people.name ASC, pets.name ASC;
Peter|Garfield
Sally|Juliet
Sally|Romeo
sqlite> 
```

Gist with test:
https://gist.github.com/danielgracia/7fc63f39f7c8068ca12a

