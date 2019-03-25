---
title: can't use fixtures with a created engine
labels: engines
layout: issue
---

hi all, i have trouble testing an engine

``` ruby
rails plugin new something --full
```

i create an engine, and some models, then i started to test, on 'rake test' command i realized that the fixtures are not loaded, so as the helper methods to load fixtures like: 

``` ruby
people(:one)
```

it is a bug or maybe i understand this wrong and I'm using it the wrong way?

