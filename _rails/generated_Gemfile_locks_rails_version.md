---
title: generated Gemfile locks rails version
labels: railties
layout: issue
---

default generator locks application to the bootstraped rails version:

``` ruby
-gem 'rails', '3.2.2'
```

It should be giving a chance for at least updates of this version by using:

``` ruby
-gem 'rails', '~> 3.2.2'
```

or even:

``` ruby
-gem 'rails', '~> 3.2'
```

