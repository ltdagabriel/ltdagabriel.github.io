---
title: activesupport 5.0.0.1 gem: require 'active_support/core_ext' generates "circular require" warning
labels: activesupport, attached PR
layout: issue
---

This issue is similar to https://github.com/rails/rails/issues/1040, but with a newer version.
### Steps to reproduce

```
$ irb -w
> require 'active_support'; require 'active_support/core_ext'
```
### Expected behavior

```
irb(main):001:0> require 'active_support'; require 'active_support/core_ext'
=> true
irb(main):002:0>
```

This is the actual behavior with version `4.2.7.1`.
### Actual behavior

```
irb(main):001:0> require 'active_support'; require 'active_support/core_ext'
~/.rbenv/versions/2.2.4/lib/ruby/gems/2.2.0/gems/activesupport-5.0.0.1/lib/active_support/deprecation.rb:19: warning: loading in progress, circular require considered harmful - ~/.rbenv/versions/2.2.4/lib/ruby/gems/2.2.0/gems/activesupport-5.0.0.1/lib/active_support/deprecation/proxy_wrappers.rb
        from ~/.rbenv/versions/2.2.4/bin/irb:11:in  `<main>'
        from ~/.rbenv/versions/2.2.4/lib/ruby/2.2.0/irb.rb:394:in  `start'
        from ~/.rbenv/versions/2.2.4/lib/ruby/2.2.0/irb.rb:394:in  `catch'
        from ~/.rbenv/versions/2.2.4/lib/ruby/2.2.0/irb.rb:395:in  `block in start'
        from ~/.rbenv/versions/2.2.4/lib/ruby/2.2.0/irb.rb:485:in  `eval_input'
        from ~/.rbenv/versions/2.2.4/lib/ruby/2.2.0/irb/ruby-lex.rb:230:in  `each_top_level_statement'
        from ~/.rbenv/versions/2.2.4/lib/ruby/2.2.0/irb/ruby-lex.rb:230:in  `catch'
        from ~/.rbenv/versions/2.2.4/lib/ruby/2.2.0/irb/ruby-lex.rb:231:in  `block in each_top_level_statement'
        from ~/.rbenv/versions/2.2.4/lib/ruby/2.2.0/irb/ruby-lex.rb:231:in  `loop'
        from ~/.rbenv/versions/2.2.4/lib/ruby/2.2.0/irb/ruby-lex.rb:245:in  `block (2 levels) in each_top_level_statement'
        from ~/.rbenv/versions/2.2.4/lib/ruby/2.2.0/irb.rb:486:in  `block in eval_input'
        from ~/.rbenv/versions/2.2.4/lib/ruby/2.2.0/irb.rb:623:in  `signal_status'
        from ~/.rbenv/versions/2.2.4/lib/ruby/2.2.0/irb.rb:489:in  `block (2 levels) in eval_input'
        from ~/.rbenv/versions/2.2.4/lib/ruby/2.2.0/irb/context.rb:379:in  `evaluate'
        from ~/.rbenv/versions/2.2.4/lib/ruby/2.2.0/irb/workspace.rb:86:in  `evaluate'
        from ~/.rbenv/versions/2.2.4/lib/ruby/2.2.0/irb/workspace.rb:86:in  `eval'
        from (irb):1:in  `irb_binding'
        from (irb):1:in  `require'
        from ~/.rbenv/versions/2.2.4/lib/ruby/gems/2.2.0/gems/activesupport-5.0.0.1/lib/active_support/core_ext.rb:2:in  `<top (required)>'
        from ~/.rbenv/versions/2.2.4/lib/ruby/gems/2.2.0/gems/activesupport-5.0.0.1/lib/active_support/core_ext.rb:2:in  `each'
        from ~/.rbenv/versions/2.2.4/lib/ruby/gems/2.2.0/gems/activesupport-5.0.0.1/lib/active_support/core_ext.rb:3:in  `block in <top (required)>'
        from ~/.rbenv/versions/2.2.4/lib/ruby/gems/2.2.0/gems/activesupport-5.0.0.1/lib/active_support/core_ext.rb:3:in  `require'
        from ~/.rbenv/versions/2.2.4/lib/ruby/gems/2.2.0/gems/activesupport-5.0.0.1/lib/active_support/core_ext/load_error.rb:1:in  `<top (required)>'
        from ~/.rbenv/versions/2.2.4/lib/ruby/gems/2.2.0/gems/activesupport-5.0.0.1/lib/active_support/core_ext/load_error.rb:1:in  `require'
        from ~/.rbenv/versions/2.2.4/lib/ruby/gems/2.2.0/gems/activesupport-5.0.0.1/lib/active_support/deprecation/proxy_wrappers.rb:3:in  `<top (required)>'
        from ~/.rbenv/versions/2.2.4/lib/ruby/gems/2.2.0/gems/activesupport-5.0.0.1/lib/active_support/deprecation/proxy_wrappers.rb:4:in  `<module:ActiveSupport>'
        from ~/.rbenv/versions/2.2.4/lib/ruby/gems/2.2.0/gems/activesupport-5.0.0.1/lib/active_support/deprecation.rb:3:in  `<top (required)>'
        from ~/.rbenv/versions/2.2.4/lib/ruby/gems/2.2.0/gems/activesupport-5.0.0.1/lib/active_support/deprecation.rb:6:in  `<module:ActiveSupport>'
        from ~/.rbenv/versions/2.2.4/lib/ruby/gems/2.2.0/gems/activesupport-5.0.0.1/lib/active_support/deprecation.rb:19:in  `<class:Deprecation>'
        from ~/.rbenv/versions/2.2.4/lib/ruby/gems/2.2.0/gems/activesupport-5.0.0.1/lib/active_support/deprecation.rb:19:in  `require'
=> true
irb(main):002:0>
```

This is the actual behavior of version `5.0.0.beta1` thru `5.0.0.1`.
### System configuration

**Rails version**: `5.0.0.beta1` to `5.0.0.1`

**Ruby version**: `2.2.4` (on OSX)
### Git Bisect

A `git bisect` between https://github.com/rails/rails/tree/4-2-stable and https://github.com/rails/rails/tree/v5.0.0 revealed https://github.com/rails/rails/commit/20c1484993bfc9314ed8f44ab9779e54fb605a01 as the first "bad" commit (/cc @akshay-vishnoi)

