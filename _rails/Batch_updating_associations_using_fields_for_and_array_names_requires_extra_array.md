---
title: Batch updating associations using `fields_for` and array names requires extra array
labels: With reproduction steps, actionview
layout: issue
---

### Steps to reproduce

Application upgraded from 4.2 to 5.0.0 following the official upgrade guides.

Unusual behaviour in `fields_for` when used to batch create or update records using `model[]`.

(Guidelines for creating a bug report are [available
here](http://guides.rubyonrails.org/contributing_to_ruby_on_rails.html#creating-a-bug-report))

### Expected behavior

Something like the following should create an input to update an attribute of an association that `belongs_to` a record, customisable:

```haml
= form_for(controller: 'records', action: 'batch_create') do
  - @records.each do |record|
    = fields_for('associations[]', record.association) do |assoc|
      = assoc.number_field(:association_attribute)
```

Expected HTML:

```html
<form foo="bar">
  <input type="number" name="associations[1][association_attribute]" />
  <input type="number" name="associations[2][association_attribute]" />
  <!-- repeat for each associated record -->
</form>
```

### Actual behavior

HTML produced:

```html
<form foo="bar">
  <input type="number" name="associations[association_attribute]" />
  <input type="number" name="associations[association_attribute]" />
  <!-- repeat for each associated record -->
</form>
```

This produces the same behaviour as if we had just used `fields_for('associations')`

### System configuration
**Rails version**: 5.0.0

**Ruby version**: 2.2.3

