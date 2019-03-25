---
title: ActiveStorage: DirectUploads - 'undefined' instead item.signed_id in params
labels: activestorage
layout: issue
---

### Steps to reproduce

I want to add the incredible ActiveStorage feature to my project, but I've faced a problem with direct uploads.
I've used [rails guides](http://edgeguides.rubyonrails.org/active_storage_overview.html) for setup.

### Expected behavior
After the direct upload is done activestorage.js should put signed_id to the hidden input value and submit a form.
### Actual behavior

File saved, everything is fine, but the value of the hidden input:
```<input type="hidden" name="meeting[documents][]" value="undefined">```
and form get submitted.

I've found what ```i.signed_id``` returns `undefined` here:
```
this.directUpload.create(function(n, i) {
        n ? (r.parentNode.removeChild(r), e.dispatchError(n)) : r.value = i.signed_id,e.dispatch("end"),t(n)}
```
And changed this to ```i.blob.signed_id```, what (I'm not sure) fixes the problem.
Anyone else faced this problem? Or I broke something?

### System configuration
**Rails version**: 5-2-stable

**Ruby version**: ruby 2.4.1

