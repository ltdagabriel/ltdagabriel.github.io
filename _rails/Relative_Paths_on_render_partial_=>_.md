---
title: Relative Paths on render :partial => 
labels: actionpack
layout: issue
---

Currently all relative paths on the partial path are relative to the `app/view` directory, however let's suppose we have the following directory structure:

```
app/view
  > layouts
    > shared
      - _header.html.erb
      - _some_header_stuff.html.erb
      - _footer.html.erb
      - _navigation.html.erb
    - application.html.erb
```

From `application.html.erb` you would the partial via:
- `./shared/header` or `layouts/shared/header`.

From `header` you could render the partial `_some_header_stuff.html.erb`  via:
- `./some_header_stuff` or `layouts/shared/some_header_stuff`.

This would allow to have a more organized view directory, with less than 13 files bouncing around root directories, without having to write incredible long paths every time.

Organization is good, according to @dhh - and this would support that goal.

