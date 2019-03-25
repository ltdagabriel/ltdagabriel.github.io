---
title: assets:precompile task does not detect index files
labels: asset pipeline
layout: issue
---

I'm using rails 3.1.3 and having assets packed like this:

```
app/assets/javascripts/my_cool_stuff/
  index.js
  file1.js.coffee
  file2.js.coffee
  ...
```

The `index.js` file contains sprockets `require_tree .` call.

So in development i can type `javascript_include_tag 'my_cool_stuff'` and it will actually include `my_cool_stuff/index.js` and all files from `my_cool_stuff` folder.

However in production it doesn't work. If you add `my_cool_stuff.js`  to `config.assets.precompile` and run `assets:precompile` rake-task it will not compile cause rails will look for the the actual file `my_cool_stuff.js` and not `my_cool_stuff/index.js`.

I think this is pretty misleading that you can include folders with index files in development but can not get them compiled for production.

