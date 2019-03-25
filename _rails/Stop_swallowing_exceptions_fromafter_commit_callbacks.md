---
title: Stop swallowing exceptions from`after_commit` callbacks
labels: activerecord
layout: issue
---

see also now closed pull request:
   https://github.com/rails/rails/pull/11123

rails could 
 a) log all exceptions raised in after_commit callbacks
 b) re-raise the first or last exception after the last callback block has been called

The current behavior can lead to bugs that are terribly frustrating to track down. "It would make sense if I got an exception there, but I didn't"

