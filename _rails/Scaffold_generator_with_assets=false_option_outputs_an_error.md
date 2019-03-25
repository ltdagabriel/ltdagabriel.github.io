---
title: Scaffold generator with --assets=false option outputs an error
labels: railties
layout: issue
---

```
bundle exec rails g scaffold quote id:integer asset_id:string value:decimal --migration=false --assets=false
```

will output

```
...
       error  false [not found]
...
```

for assets generator

