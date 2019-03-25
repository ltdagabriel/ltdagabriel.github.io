---
title: Custom name for file_field is incorrect when using :multiple => true
labels: actionview, regression
layout: issue
---

In Rails 3.2.13 square brackets are appended to a custom name for `file_field` when using `:multiple => true`. I think this may be a bug.

The following code:

```
<%= f.file_field :attachment, :multiple => true, :name => 'user_file[attachment]' %>
```

generates the following html:

```
<input id="user_file_attachment" multiple="multiple" name="user_file[attachment][]" type="file" />
```

The reason I am setting a custom name attribute is that I want it to be:

```
<input id="user_file_attachment" multiple="multiple" name="user_file[attachment]" type="file" />
```

This does not seem to be possible when using the helper in Rails 3.2.13. I have to revert to plain HTML as a workaround.

In Rails 3.2.12 it was working like I expected it to work.

