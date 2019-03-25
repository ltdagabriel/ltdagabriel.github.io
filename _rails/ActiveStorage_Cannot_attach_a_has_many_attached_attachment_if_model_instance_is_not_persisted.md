---
title: ActiveStorage: Cannot attach a has_many_attached attachment if model instance is not persisted
labels: activestorage
layout: issue
---

Hi guys,
I'm seeing a discrepancy in the `#attach` behaviour for a `has_one_attached` and a `has_many_attached` model instance if an attachment is attached before the model instance is saved.
Specifically, for a model w/ `has_one_attached`, you can attach an attachment before the model instance is saved. However, for a model w/ `has_many_attached`, if you try to attach an attachment before the model is saved, the following exception is raised:
`ActiveRecord::RecordNotSaved: You cannot call create unless the parent is saved`

I've done some testing below, and found a temporary work-around, but it is not the ideal solution.

### Steps to reproduce
```
class Comment < ApplicationRecord
  has_many_attached :files
  # ...
end

Comment.new.files.attach(io: File.open('path/to/file'), filename: 'test.pdf', content_type: 'application/pdf')
# => ActiveRecord::RecordNotSaved: You cannot call create unless the parent is saved
```

I dug into the `ActiveStorage::Attached::Many`, and comparing with how `attach` is handled in `ActiveStorage::Attached::One` I did the following to find a temporary solution. It reveals, in my opinion, some weird and unintuitive behaviour:

```
def attach(*attachables)
      attachables.flatten.collect do |attachable|        
        # If record does not yet persist

        # Fails (original) => Raises exception
        # Raises ActiveRecord::RecordNotSaved: You cannot call create unless the parent is saved
        attachments.create!(name: name, blob: create_blob_from(attachable))

        # Including record => Raises exception
        # Raises ActiveRecord::RecordNotSaved: You cannot call create unless the parent is saved
        # attachments.create!(name: name, record: record, blob: create_blob_from(attachable))

        # building then saving => Raises different exception
        # Raises ActiveRecord::RecordInvalid: Validation failed: Record must exist
        # attachments.build(name: name, blob: create_blob_from(attachable)).save!

        # building with record, then saving => Works!
        # attachments.build(name: name, record: record, blob: create_blob_from(attachable)).save!
      end
    end
```
Weird, huh? I was surprised that `build` -> `save!` works, but a straight `create!` with an included record doesn't.

Again, perhaps this is by design, but thought it weird that the two attachments `One` and `Many` have different behaviour here.

**Rails version**:
rails 5.2.0.alpha

**Ruby version**:
ruby 2.4.2
