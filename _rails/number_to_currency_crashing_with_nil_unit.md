---
title: number_to_currency crashing with nil unit
labels: activesupport, attached PR
layout: issue
---

### Steps to reproduce

`number_to_currency(42, unit: nil)`
### Expected behavior

A string without unit (as nil separator or nil delimiter outputs no separator or no delimiter)

`42.00`
### Actual behavior

```
TypeError: no implicit conversion of nil into String
    from /Users/hugohache/.rbenv/versions/2.3.0/lib/ruby/gems/2.3.0/gems/activesupport-4.2.6/lib/active_support/number_helper/number_to_currency_converter.rb:16:in `gsub'
    from /Users/hugohache/.rbenv/versions/2.3.0/lib/ruby/gems/2.3.0/gems/activesupport-4.2.6/lib/active_support/number_helper/number_to_currency_converter.rb:16:in `convert'
    from /Users/hugohache/.rbenv/versions/2.3.0/lib/ruby/gems/2.3.0/gems/activesupport-4.2.6/lib/active_support/number_helper/number_converter.rb:132:in `execute'
    from /Users/hugohache/.rbenv/versions/2.3.0/lib/ruby/gems/2.3.0/gems/activesupport-4.2.6/lib/active_support/number_helper/number_converter.rb:118:in `convert'
    from /Users/hugohache/.rbenv/versions/2.3.0/lib/ruby/gems/2.3.0/gems/activesupport-4.2.6/lib/active_support/number_helper.rb:86:in `number_to_currency'
    from /Users/hugohache/.rbenv/versions/2.3.0/lib/ruby/gems/2.3.0/gems/actionview-4.2.6/lib/action_view/helpers/number_helper.rb:388:in `public_send'
    from /Users/hugohache/.rbenv/versions/2.3.0/lib/ruby/gems/2.3.0/gems/actionview-4.2.6/lib/action_view/helpers/number_helper.rb:388:in `block in delegate_number_helper_method'
    from /Users/hugohache/.rbenv/versions/2.3.0/lib/ruby/gems/2.3.0/gems/actionview-4.2.6/lib/action_view/helpers/number_helper.rb:412:in `wrap_with_output_safety_handling'
    from /Users/hugohache/.rbenv/versions/2.3.0/lib/ruby/gems/2.3.0/gems/actionview-4.2.6/lib/action_view/helpers/number_helper.rb:387:in `delegate_number_helper_method'
    from /Users/hugohache/.rbenv/versions/2.3.0/lib/ruby/gems/2.3.0/gems/actionview-4.2.6/lib/action_view/helpers/number_helper.rb:108:in `number_to_currency'
```
### System configuration

**Rails version**: 4.2.6

**Ruby version**: 2.3.0

