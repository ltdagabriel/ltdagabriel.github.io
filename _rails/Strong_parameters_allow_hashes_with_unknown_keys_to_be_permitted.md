---
title: Strong parameters: allow hashes with unknown keys to be permitted
labels: actionpack
layout: issue
---

From what I can tell, strong parameters currently has no ability to permit a hash with unknown keys. Where this would be particularly useful is for the newly supported Hstore and JSON data types -- a good example of this use case can be found here: http://schneems.com/post/19298469372/you-got-nosql-in-my-postgres-using-hstore-in-rails

I would have expected that passing an empty hash as an permitted value would allow a hash to be passed through. e.g.

```
params = ActionController::Parameters.new(product: { name: 'Test', data: { weight: '12kg' } })
params.require(:product).permit(:name, data: {})
```

however this does not pass the data hash through (though it is not documented that it should work).

Assigning the data parameter separately is an option but it complicates my code unnecessarily -- I would prefer to be able to stick with mass-assignment for all attributes.

Happy to work on a patch for this if this proposal is reasonable. I've only just started looking into strong parameters though so there may be drawbacks I haven't considered.

