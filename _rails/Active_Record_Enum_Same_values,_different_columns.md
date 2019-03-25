---
title: Active Record Enum - Same values, different columns
labels: activerecord, enum
layout: issue
---

It's currently not possible to have enums with the same values on different columns in the same model.

A crude example might be a `Book` with `author_visibility` and `illustrator_visibility` columns for which you'd like to use the same `public`/`private` values on both columns.

It'd require changing the current enum API some.
Probably you'd have to do `book.author_visibility.private!` rather than `book.private!`.

I feel like that kind of approach might be nicer as it could potentially allow enum reuse between models, too. Maybe syntax like:

```
enum VisibilityEnum :illustrator_visibility
```

where VisibilityEnum is an object with the enum mapping and the symbol is the column name.

Anyway, I'm probably going to work around the issue manually for the moment. (I have 3 columns with the same 12-value 'enum,' none can be `null`, and can't decompose since they're essentially treated as a 3-tupple coordinate.)

My use case may be atypical, too, but thought I'd bring it up.

