---
title: Can't cast ActionController::Parameters as hash for hstore attributes
labels: With reproduction steps, actionpack, activerecord, attached PR, regression
layout: issue
---

### Steps to reproduce

Create a record where you'd assign the attribute using params that have nested hashes:

``` ruby
irb(main):001:0> params = ActionController::Parameters.new(user_answer: { "stuff" => 1, "more stuff" => 2 })
=> <ActionController::Parameters {"user_answer"=>{"stuff"=>1, "more stuff"=>2}} permitted: false>

irb(main):002:0> user_answer_params = params.require(:user_answer).permit!
=> <ActionController::Parameters {"stuff"=>1, "more stuff"=>2} permitted: true>

irb(main):005:0> Submission.create(answer: user_answer_params)
```

Feel free to clone down https://github.com/mxie/hstore-casting-bug to test.
### Expected behavior

The record should save.
### Actual behavior

A `TypeError` is raised:

``` ruby
irb(main):005:0> Submission.create(answer: user_answer_params)
   (0.2ms)  BEGIN
   (0.2ms)  ROLLBACK
TypeError: can't cast ActionController::Parameters
# ...
```
### System configuration

**Rails version**: 5.0.0.1

**Ruby version**: 2.3.1

