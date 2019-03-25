---
title: Rails 3.2.11 regression with non-object JSON content
labels: actionpack
layout: issue
---

Hi,

`ActionDispatch::Request.deep_munge` (action_dispatch/http/request.rb) assumes it receives a hash. This breaks if you pass a JSON string/int/float/nil (e.g. "adasd") in the POST/PUT request with application/json content type.

The typical example is when modifying an attribute in a RESTful manner - PUT /user/name where 'name' is an attribute of user, which results in an exception in Rails' stack.

The offending call is in lib/action_dispatch/middleware/params_parser.rb:47. Unlike the fix for handling of XMLs, it should test if JSON.decode returned a non-object (string/int/float/array/nil) and call deep_munge only if it's a hash.

```
NoMethodError (undefined method `each' for "my_new_attr_content":String)
  actionpack (3.2.11) lib/action_dispatch/http/request.rb:252:in `deep_munge'
  actionpack (3.2.11) lib/action_dispatch/middleware/params_parser.rb:47:in `parse_formatted_parameters'
  actionpack (3.2.11) lib/action_dispatch/middleware/params_parser.rb:17:in `call'
  actionpack (3.2.11) lib/action_dispatch/middleware/flash.rb:242:in `call'
```

Commit causing this: https://github.com/rails/rails/commit/d5cd97baa44fa66dc681041a213092b45c57c32

Similar issue - but not the same: https://github.com/rails/rails/issues/8832

Thanks,
Tal

