---
title: Rails 4.1.0.rc1 - Mailers#preview + inline attachment => NoMethodError
labels: actionmailer, attached PR
layout: issue
---

I'm getting a `NoMethodError in Rails::Mailers#preview` when I try to preview an email view that has an inline attachment (in my case, a .png image).

More precisely:

```
.../gems/ruby-2.0.0-p195@rails410rc1/gems/railties-4.1.0.rc1/lib/rails/templates/rails/mailers/email.html.erb where line #95 raised:

undefined method `mime_type' for #<Array:0xdd84674>
```

Line #95 is:

```
<iframe seamless name="messageBody" src="?part=<%= Rack::Utils.escape(@part.mime_type) %>"></iframe>
```

Note:
- Removing this attachment from `def my_mail [...] end` makes the error vanish.
- Setting this inline attachment to "not inline" does not make the error vanish.
- ".deliver"-ing the email despite the preview error message does send it correctly (the inline attachment is rendered correctly).

