---
title: Exception when attribute is `Infinity` in `Hash`
labels: activesupport, attached PR
layout: issue
---

Issue was originally opened here: https://github.com/rails-api/active_model_serializers/issues/1946
I was asked to open an issue here to see if this is a rails bug, since the exception is not limited to `active_model_serializers` and it will be raised anytime when object's `#to_json` method returns Hash with `Infinity`. 
### Steps to reproduce

use following gem for the test case `'active_model_serializers', '~> 0.10.0'`

```
class FailCase
  include ActiveModel::Serialization

  def fail; 1/0.0; end
end

class FailCaseSerializer < ActiveModel::Serializer
  attribute :fail
end

FailCaseSerializer.new(FailCase.new).to_json
```
### Expected behavior

Expected: calling `#to_json` on a serializer instance with an attribute that has value of `Infinity` should return that attribute as `null`
### Actual behavior

getting `JSON::GeneratorError: 836: Infinity not allowed in JSON` exception

When calling `to_json` on a hash that has a key with a value of `Infinity`, rails returns `null` for that key, however if the object passed to the renderer returns hash that has a key with a value of `Infinity` when calling `#to_json`, rails will not filter out invalid keys/values additionally on that hash (like it does during `Hash#to_json` and will raise error during json generation. 

```
serializer = FailCaseSerializer.new(FailCase.new)
serializer.to_hash #=> {:fail=>Infinity}
serializer.to_hash.to_json #=> {"fail":null}
serializer.to_json #=> Exception: JSON::GeneratorError: 836: Infinity not allowed in JSON
```

looking at the trace it looks like `ActiveSupport::JSON::Encoding` is receiving `Hash` not `Hash.as_json`
### System configuration

**Rails version**: `5.0.0.1`
**Ruby version**: `ruby 2.3.1p112 (2016-04-26 revision 54768) [x86_64-darwin16]`
### Backtrace

```
Exception: JSON::GeneratorError: 836: Infinity not allowed in JSON
--
 0: /Users/afsoon/.rvm/rubies/ruby-2.3.1/lib/ruby/2.3.0/json/common.rb:224:in `generate'
 1: /Users/afsoon/.rvm/rubies/ruby-2.3.1/lib/ruby/2.3.0/json/common.rb:224:in `generate'
 2: /Users/afsoon/.rvm/gems/ruby-2.3.1/gems/activesupport-5.0.0.1/lib/active_support/json/encoding.rb:99:in `stringify'
 3: /Users/afsoon/.rvm/gems/ruby-2.3.1/gems/activesupport-5.0.0.1/lib/active_support/json/encoding.rb:33:in `encode'
 4: /Users/afsoon/.rvm/gems/ruby-2.3.1/gems/activesupport-5.0.0.1/lib/active_support/json/encoding.rb:20:in `encode'
 5: /Users/afsoon/.rvm/gems/ruby-2.3.1/gems/activesupport-5.0.0.1/lib/active_support/core_ext/object/json.rb:37:in `to_json'
```

