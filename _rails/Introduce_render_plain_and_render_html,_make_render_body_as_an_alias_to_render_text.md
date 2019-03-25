---
title: Introduce `render :plain` and `render :html`, make `render :body` as an alias to `render :text`
labels: actionpack, attached PR
layout: issue
---

This is related to #3234.

Per discussion, `render :text` misdirect people to think that it would render content with `text/plain` MIME type. However, `render :text` actually sets the response body directly, and inherits the default response MIME type, which is `text/html`.

In order to reduce confusion, we're introducing 3 more render format to `render`:

``` ruby
render html: '<strong>HTML String</strong>' # render with `text/html` MIME type

render plain: 'plain text' # render with `text/plain` MIME type

render body: 'raw body' # render raw content, does not set content type, inherits 
                        # default content type, which currently is `text/html`
```

We want to phrase out the usage of `render :text`, to reduce the confusion in the future. There's currently no plan for deprecating `render :text`.

---

Progress: [here](https://github.com/sikachu/rails/compare/rails:master...sikachu:ps-render-format?expand=1)
- [x] adds `render :body`
- [x] adds `render :plain`
- [x] adds `render :html`
- [ ] deprecates `render :text`

