---
title: time_ago_in_words reports the wrong number of months.
labels: actionview
layout: issue
---

As seen below, time_ago_in_words reports about 1 month ago for an almost 2 month difference. I think this needs to be more precise and say less than 2 months ago or something indicating that it is over a month.

$ rails -v
Rails 3.0.9
irb(main):002:0> require 'rubygems'
=> nil
irb(main):003:0> require 'action_view'
=> nil
irb(main):004:0> include ActionView::Helpers::DateHelper
=> Object
irb(main):002:0> require 'rubygems'
=> nil
irb(main):003:0> require 'action_view'
=> nil
irb(main):004:0> include ActionView::Helpers::DateHelper
=> Object
irb(main):005:0> a=Date.new(2011, 9, 9)
=> Fri, 09 Sep 2011
irb(main):006:0> time_ago_in_words(a)
=> "about 1 month"
irb(main):007:0> Date.today
=> Mon, 07 Nov 2011

