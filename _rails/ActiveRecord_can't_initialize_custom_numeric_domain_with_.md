---
title: ActiveRecord 4 can't initialize custom numeric domain with ""
labels: PostgreSQL, activerecord
layout: issue
---

I have a custom domain like `create domain custom_money numeric(8,2)`. Rails can't initialize that with `""` (say, from a form).

https://github.com/joevandyk/rails/commit/d95cef8c786e18ff0108a43be841b41101e19d5a has a test.

