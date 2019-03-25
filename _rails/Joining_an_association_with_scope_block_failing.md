---
title: Joining an association with scope block failing
labels: activerecord
layout: issue
---

When defining a scope block for associations fails in some cases.
The problem isn't when getting the association but when joining by it, and it depends on how the association scope is defined. 
I included 4 test cases. 2 of them work, and 2 of them fail.
In the cases that fail, the conditions aren't joined with an AND but with a comma.

Here's the gist with the tests:
https://gist.github.com/iwiznia/6295952

