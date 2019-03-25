---
title: Bug searching the first object in an ordered collection by a dotted string
labels: activerecord
layout: issue
---

I don't know if this is an expected behaviour, but when I do:

``` ruby
Business.order(:name).where(name: 'Codegram S.L.').first
```

I get the following error:

```
NoMethodError: undefined method `gsub' for :name:Symbol
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/activerecord-3.2.12/lib/active_record/connection_adapters/postgresql_adapter.rb:1106:in `block in distinct'
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/activerecord-3.2.12/lib/active_record/connection_adapters/postgresql_adapter.rb:1106:in `collect'
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/activerecord-3.2.12/lib/active_record/connection_adapters/postgresql_adapter.rb:1106:in `distinct'
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/activerecord-3.2.12/lib/active_record/relation/finder_methods.rb:254:in `construct_limited_ids_condition'
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/activerecord-3.2.12/lib/active_record/relation/finder_methods.rb:243:in `apply_join_dependency'
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/activerecord-3.2.12/lib/active_record/relation/finder_methods.rb:232:in `construct_relation_for_association_find'
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/activerecord-3.2.12/lib/active_record/relation/finder_methods.rb:211:in `find_with_associations'
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/activerecord-3.2.12/lib/active_record/relation.rb:171:in `exec_queries'
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/activerecord-3.2.12/lib/active_record/relation.rb:160:in `block in to_a'
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/activerecord-3.2.12/lib/active_record/explain.rb:40:in `logging_query_plan'
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/activerecord-3.2.12/lib/active_record/relation.rb:159:in `to_a'
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/activerecord-3.2.12/lib/active_record/relation.rb:189:in `exec_queries'
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/activerecord-3.2.12/lib/active_record/relation.rb:160:in `block in to_a'
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/activerecord-3.2.12/lib/active_record/explain.rb:33:in `logging_query_plan'
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/activerecord-3.2.12/lib/active_record/relation.rb:159:in `to_a'
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/activerecord-3.2.12/lib/active_record/relation/finder_methods.rb:378:in `find_first'
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/activerecord-3.2.12/lib/active_record/relation/finder_methods.rb:122:in `first'
    from (irb):1
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/railties-3.2.12/lib/rails/commands/console.rb:47:in `start'
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/railties-3.2.12/lib/rails/commands/console.rb:8:in `start'
    from /Users/marc/.rvm/gems/ruby-1.9.3-p327@empresaula/gems/railties-3.2.12/lib/rails/commands.rb:41:in `<top (required)>'
    from script/rails:6:in `require'
    from script/rails:6:in `<main>'
```

This happens in Rails 3.2.12 and only if all of the following conditions are matched:
- the `order` method gets a `symbol`
- the string used on `where` contains a dot (`.`)
- we call the `first` method after the `where` method

**Workarounds**:
- Use `.all.first` instead of `.first` directly:

```
Business.order(:name).where(name: 'Codegram S.L.').all.first
```
- Pass a String to the `order` method:

```
Business.order(`name`).where(name: 'Codegram S.L.').first
```

I'll send a PR myself to solve this if you think this is a bug :)

