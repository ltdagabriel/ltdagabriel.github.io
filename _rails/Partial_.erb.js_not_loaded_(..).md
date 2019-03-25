---
title: Partial *.erb.js not loaded (3.2.12)
labels: actionview
layout: issue
---

Rails 3.2.12 doesn't seem to want to load partials in the format

```
*.erb.js
```

or

```
*.js.erb
```

such as:

```
app/views/shared/some_folder/_my_partial.erb.js
```

(the file contains mainly JS with some erb tags, but that is probably not the question here)

The call is:

``` ruby
<%= render partial: 'shared/some_folder/my_partial', locals: {...} %>
```

The error is:

```
ActionView::MissingTemplate
```

Additionally specifying in the partial call...
- `handlers: [:js]` or
- `handlers: [:erb]` or
- `handlers: [:js, :erb]`

...doesn't solve the issue.

Only renaming the file to `*.erb` seems to work.

