---
title: attribute_will_change! can add non persisted attributes to arel and try to write them to the database
labels: activerecord, needs feedback
layout: issue
---

When I call attribtue_will_change! on a non-persisted attribute it adds the attribute to the changes hash. Eventually, this hash is sent to arel_attributes_with_values and the code attempts to write to a column that is non-existent. This is new to rails 4.2, I was attempting to use the attribue_will_change! method to trigger various callbacks that run on save, these callbacks take the non-persisted attribute and parse it into its various database fields. Before the rails 4.2 upgrade the code would know that the non-persisted attribute shouldn't be saved and would build the query without it. I'm not sure of the change or the most efficient fix. 
Thanks for the help!

