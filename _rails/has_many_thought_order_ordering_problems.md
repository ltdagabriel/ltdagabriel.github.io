---
title: has_many :thought order ordering problems
labels: activerecord
layout: issue
---

My problem is:

A default_scope :order => "position ASC"

B has_many BJoinA
B has_many A :through BJoinA, :order => "BJoinA.position ASC"

I have A to ordered in a certain way.
and I have B's As ordered in a different way (though the join model).

But B.first.as does not return me As ordered by BJoinA position because the select include A's default_scope ordering first.

Is there a way to ignore default_scope (order) in has_many :through association?
Or should the join order be respected first?

the resulted select is:
SELECT "AS".\* FROM "AS" INNER JOIN "B_AS" ON "AS".id = "B_AS".A_ID WHERE (("B_AS".B_ID = 3)) ORDER BY position ASC, B_AS.position ASC

I would like the B_AS.position AS to be the first condition

Using 3.0.4 or 3.0.7

Thanks

