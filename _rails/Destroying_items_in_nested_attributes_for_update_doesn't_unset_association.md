---
title: Destroying items in nested_attributes_for update doesn't unset association
labels: activerecord
layout: issue
---

Here's the bug: when assigning to a belongs_to relationship (and I believe one-to-one, but I haven't verified yet) if you mark the association for destruction the association is not unset yet the record is deleted. This result in both unexpected behavior: the association seems to still be present in memory after the update, and in invalid data being saved (foreign key violations) because the parent record saved still has the association_id set even though the associated record has been destroyed. 

This also occurs with has_many collections: items marked for destruction are still present in the in-memory list after the attributes= call.

Here is a branch with test cases:
https://github.com/jcoleman/rails/commit/4ea3ae07f9c6cfeaa447a5c9634f85dc38eac740

I'm willing to develop a patch, but would like some guidance on the way that people would prefer it to be implemented.

This would be trivial (I've already written code to unset the value), but the problem is that to trigger the record deletion, the association still needs to be there to be walked on the save call. 

I have two questions:
1. Does everyone agree on the expected behavior? 
2. What is the best implementation route: should I maintain a hidden list/hash on each object of associations that have been unset and marked for deletion to use both at saving and if someone resets the object? Or is that capability already essentially available in the change tracking? Or something different all-together.

I also emailed about this on the Core mailing list: https://groups.google.com/group/rubyonrails-core/browse_thread/thread/b75eeaf1062aca66

