---
title: Creating a record with create! with a missing required belongs_to relationship doesn't raise an error
labels: activerecord, attached PR
layout: issue
---

I've noticed that on Rails 5.0.0.beta2 that creating a new record using `Model.create!` doesn't raise any errors and creates an invalid record when there is a missing `belongs_to` relationship. 

This assume that `belongs_to_required_by_default` is `true` and the `belongs_to` relationship doesn't specify any options for `optional` or `required` implying that it is required.

Is this desired behaviour? I'd have thought this should raise a normal `ActiveRecord::RecordInvalid` exception.

