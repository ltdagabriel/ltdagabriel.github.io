---
title: ENV['RAILS_RELATIVE_URL_ROOT'] and url_for
labels: With reproduction steps, actionpack
layout: issue
---

I wanted to deploy a rails app into a subdirectory, and setting RAILS_RELATIVE_URL_ROOT env var works pretty well... except, it is not used in any REST-like route generation.

``` shell
horadrim:~/Code>>% rails new relative_url_root_test
Using -T --skip-bundle from /Users/js/.railsrc
...
horadrim:~/Code>>% cd relative_url_root_test
horadrim:~/Code/relative_url_root_test>>% bundle --path vendor --binstubs
Fetching gem metadata from https://rubygems.org/.........
...
horadrim:~/Code/relative_url_root_test>>% script/rails g scaffold page title:string body:text
...
horadrim:~/Code/relative_url_root_test>>% bin/rake db:migrate
...
horadrim:~/Code/relative_url_root_test>>% RAILS_RELATIVE_URL_ROOT=/subdir script/rails c
Loading development environment (Rails 3.2.1)
irb(main):001:0> app.url_for Page
=> "http://www.example.com/pages"
```

Shouldn't it be http://www.example.com/subdir/pages ?

