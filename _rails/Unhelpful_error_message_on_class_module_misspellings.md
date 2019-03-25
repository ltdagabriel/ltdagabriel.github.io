---
title: Unhelpful error message on class/module misspellings
labels: actionpack, activesupport
layout: issue
---

On a brand new rails/master app, create app/helpers/stuff_helper.rb and then have that declare StoffHelper. So, a simple misspelling. This is the error:

![action controller_ exception caught-1](https://cloud.githubusercontent.com/assets/2741/3883671/34dcc726-21a4-11e4-9bdd-405288768ea6.png)

