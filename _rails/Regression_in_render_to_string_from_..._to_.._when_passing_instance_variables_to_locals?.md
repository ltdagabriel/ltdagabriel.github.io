---
title: Regression in render_to_string from 5.0.0.1 to 5.0.1 when passing instance variables to :locals?
labels: actionview, regression
layout: issue
---

Hi, I'm not sure whether this has been ever supported officially, but since it was suggested in a StackOverflow question, I was using this and maybe others too and that broke when I upgraded our Rails app:

http://stackoverflow.com/a/37763478/557368

```ruby
render_to_string(partial: "partial", formats: [:html], locals: { :@something => something }
```

I ended up fixing in our application by assigning `@something = something` before calling render_to_string, otherwise `@something` would be nil in the partial. Was this change intentional somehow? I'm just reporting in case it wasn't intentional for this patch release in case you wanted to handle this with proper warnings before removing the (maybe unintentional) support for instance variables through locals. Maybe render_to_string would support :assigns now instead of :locals for such cases, I haven't tested, but one wouldn't usually expect such breakage in a patch release, so I'm reporting in case you want to release 5.0.2 supporting applications using that trick and emit a deprecation warning in such cases.

Best,
Rodrigo.
