---
title: JSON session serializer broke flash notice
labels: actionpack
layout: issue
---

The first bad commit is b23ffd0dac895aa3fd3afd8d9be36794941731b2

How to reproduce:

```
$ ./railties/bin/rails new ../test_app
$ cd ../test_app
$ bin/rails generate scaffold Product
$ bin/rake db:migrate
$ bin/rails s
```

Now try to create an product and the notice is not present in the index page.

This broke http://intertwingly.net/projects/AWDwR4/checkdepot/section-9.3.html

