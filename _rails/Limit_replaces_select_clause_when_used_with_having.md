---
title: Limit replaces select clause when used with having
labels: activerecord, attached PR
layout: issue
---

Practical Problem:
`Thing.group("things.id, other_things.id").having("other_things.id = 1").
                        includes(:other_things).count`
vs
`Thing.group("things.id, other_things.id").having("other_things.id = 1").
                    includes(:other_things).limit(1)`

Easy way to reproduce it:

`Thing.select("b").group("things.id").having("other_things.id = 1").includes(:other_things).limit(1)`

`SELECT DISTINCT `things`.id FROM `things` LEFT OUTER JOIN `other_things` ON `other_things`.`thing_id` = `things`.`id` ...`

the select clause is completely replaced

`Thing.select("b").group("things.id").having("other_things.id = 1").includes(:other_things).count`

`SELECT COUNT(DISTINCT b) AS count_b, b, things.id AS things_id FROM `things` 
LEFT OUTER JOIN `other_things` ON `other_things`.`thing_id` = `things`.`id` GROUP BY things.id 
HAVING other_things.id = 1`

---

.count has the correct behavior, and leaves the extra columns in the select clause. .limit() replaces the select clause and breaks the query.

