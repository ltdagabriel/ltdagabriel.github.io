---
title: eager_load on a scoped has_one association can trigger n queries
labels: activerecord, attached PR
layout: issue
---

For any row where the association is empty, when the eager loaded association is accessed, another unnecessary query is triggered, trying again to fetch a result. 

Test case: https://gist.github.com/agios/9fffc2cdaf7630f4eb68

If the association is changed to has_many and used in combination with .first then it works fine, however it becomes less intuitive.

