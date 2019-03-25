---
title: Migrations RailsGuide makes reference to type modifiers that don't exist?
labels: docs, needs feedback
layout: issue
---

The RailsGuide on migrations makes reference to a generator [type modifier option](http://guides.rubyonrails.org/migrations.html#supported-type-modifiers) - namely `null` - that [doesn't seem to be implemented](http://github.com/rails/rails/blob/v4.1.1/railties/lib/rails/generators/generated_attribute.rb#L39), at least in Rails 4.1.1. Additionally the edgeguide adds a `default` option which also doesn't seem to be implemented, even on the master branch.

Here's [someone's related Stackoverflow question](http://stackoverflow.com/questions/21225100/rails-using-rails-generate-model-to-specify-non-nullable-field-type).

Although it's not clear how you _would_ use these options if they _were_ implemented, my best guesses currently produce some odd effects in the generated migration file. Examples:
- `rails g migration CreateFoo bar:string{null}` gives `t.string{null} :bar`
- `rails g migration CreateFoo bar:string{null=false}` gives `t.string{null=false} :bar`
- `rails g migration CreateFoo bar:string{null:false}` gives `t.string{null :bar`
- `rails g migration CreateFoo bar:string{5,null}` (for instance if you wanted to provide a character limit at the same time) gives:

```
t.string5 :bar
t.stringnull :bar
```

!!!

I personally think it would be nice to have these options available from the command line. If they do end up being implemented it might be worth clarifying how they're to be used with an example.

