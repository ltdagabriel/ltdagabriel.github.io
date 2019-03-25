---
title: I18n locale fallbacks for localized views don't work for mailers
labels: actionview
layout: issue
---

Pull request #7368 recently fixed issues #3512 and #840 related to fallbacks for localized views for views rendered by controllers.

However the locale fallbacks are still broken for mailer views.

Having the locale set to `de-at`, and a file called `app/views/mailer/demo.de.erb`, trying to build the mail results in an  `ActionView::MissingTemplate` exception:

```
ActionView::MissingTemplate: Missing template mailer/demo with {:locale=>[:"de-at"], :formats=>[:text], :handlers=>[:erb, :builder, :coffee]}. Searched in:
  * "/Users/benedikt/demo/app/views"
```

The issue is related to `ActionView::LookupContext#skip_default_locale!`, which is only called from within `ActionMailer::Base`:

``` ruby
I18n.locale = 'de-at'
context = Mailer(:new).lookup_context
context.find_all "mailer/demo" # => [app/views/mailer/demo.de.markerb]
context.skip_default_locale!
context.find_all "mailer/demo" # => []
```

_However:_ The issue is not related to the value `I18n.default_locale` is set to, changing this to something else (even nonsense), doesn't affect this issue.

