---
title: require_relative cannot be used if gem is installed in symlinked directory
labels: attached PR
layout: issue
---

### Steps to reproduce
Run `ruby guides/bug_report_templates/active_record_master.rb` in rails repository.

### Expected behavior
exit normally

### Actual behavior
```
/usr/local/Cellar/rbenv/1.0.0/versions/2.4.0/lib/ruby/gems/2.4.0/bundler/gems/rails-1c2ed0a05440/activesupport/lib/active_support/core_ext/object/blank.rb:104: warning: already initialized constant String::BLANK_RE
/usr/local/opt/rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/bundler/gems/rails-1c2ed0a05440/activesupport/lib/active_support/core_ext/object/blank.rb:104: warning: previous definition of BLANK_RE was here
/usr/local/Cellar/rbenv/1.0.0/versions/2.4.0/lib/ruby/gems/2.4.0/bundler/gems/rails-1c2ed0a05440/activesupport/lib/active_support/core_ext/module/delegation.rb:11: warning: already initialized constant Module::RUBY_RESERVED_KEYWORDS
/usr/local/opt/rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/bundler/gems/rails-1c2ed0a05440/activesupport/lib/active_support/core_ext/module/delegation.rb:11: warning: previous definition of RUBY_RESERVED_KEYWORDS was here
/usr/local/Cellar/rbenv/1.0.0/versions/2.4.0/lib/ruby/gems/2.4.0/bundler/gems/rails-1c2ed0a05440/activesupport/lib/active_support/core_ext/module/delegation.rb:14: warning: already initialized constant Module::DELEGATION_RESERVED_KEYWORDS
/usr/local/opt/rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/bundler/gems/rails-1c2ed0a05440/activesupport/lib/active_support/core_ext/module/delegation.rb:14: warning: previous definition of DELEGATION_RESERVED_KEYWORDS was here
/usr/local/Cellar/rbenv/1.0.0/versions/2.4.0/lib/ruby/gems/2.4.0/bundler/gems/rails-1c2ed0a05440/activesupport/lib/active_support/core_ext/module/delegation.rb:15: warning: already initialized constant Module::DELEGATION_RESERVED_METHOD_NAMES
/usr/local/opt/rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/bundler/gems/rails-1c2ed0a05440/activesupport/lib/active_support/core_ext/module/delegation.rb:15: warning: previous definition of DELEGATION_RESERVED_METHOD_NAMES was here
/usr/local/Cellar/rbenv/1.0.0/versions/2.4.0/lib/ruby/gems/2.4.0/bundler/gems/rails-1c2ed0a05440/activerecord/lib/active_record/errors.rb:244: warning: already initialized constant ActiveRecord::UnknownAttributeError
/usr/local/opt/rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/bundler/gems/rails-1c2ed0a05440/activerecord/lib/active_record/errors.rb:244: warning: previous definition of UnknownAttributeError was here
/usr/local/Cellar/rbenv/1.0.0/versions/2.4.0/lib/ruby/gems/2.4.0/bundler/gems/rails-1c2ed0a05440/activesupport/lib/active_support/concern.rb:128:in `included': Cannot define multiple 'included' blocks for a Concern (ActiveSupport::Concern::MultipleIncludedBlocks)
	from /usr/local/Cellar/rbenv/1.0.0/versions/2.4.0/lib/ruby/gems/2.4.0/bundler/gems/rails-1c2ed0a05440/activerecord/lib/active_record/relation/delegation.rb:50:in `<module:ClassSpecificRelation>'
	from /usr/local/Cellar/rbenv/1.0.0/versions/2.4.0/lib/ruby/gems/2.4.0/bundler/gems/rails-1c2ed0a05440/activerecord/lib/active_record/relation/delegation.rb:47:in `<module:Delegation>'
	from /usr/local/Cellar/rbenv/1.0.0/versions/2.4.0/lib/ruby/gems/2.4.0/bundler/gems/rails-1c2ed0a05440/activerecord/lib/active_record/relation/delegation.rb:2:in `<module:ActiveRecord>'
	from /usr/local/Cellar/rbenv/1.0.0/versions/2.4.0/lib/ruby/gems/2.4.0/bundler/gems/rails-1c2ed0a05440/activerecord/lib/active_record/relation/delegation.rb:1:in `<top (required)>'
	from /usr/local/opt/rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/bundler/gems/rails-1c2ed0a05440/activerecord/lib/active_record/base.rb:21:in `require_relative'
	from /usr/local/opt/rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/bundler/gems/rails-1c2ed0a05440/activerecord/lib/active_record/base.rb:21:in `<top (required)>'
	from guides/bug_report_templates/active_record_master.rb:20:in `require'
	from guides/bug_report_templates/active_record_master.rb:20:in `<main>'
```

### System configuration
**Rails version**: master

**Ruby version**: 2.4.0

It goes wrong since #29638 and https://github.com/rails/rails/pull/29638#issuecomment-312584283 seems related.
My rbenv setup is symlinked:
```
ls -l /usr/local/opt/rbenv
lrwxr-xr-x  1 yskkin  admin  21  8 28  2016 /usr/local/opt/rbenv -> ../Cellar/rbenv/1.0.0
```

I think this is default for `brew install rbenv`.

