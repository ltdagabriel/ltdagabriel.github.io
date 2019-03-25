---
title: i18n locale fallback for localized views
labels: i18n
layout: issue
---

Given that I have set i18n to fall back (e.g. from "fr-Fr" to just "fr"):

I18n::Backend::Simple.send(:include, I18n::Backend::Fallbacks)

And I have created a localized view (e.g. /help/index.fr.html.erb)

When i18n locale is set to "fr-FR", then the localized view is not found - yet the language file config/locales/fr.yml is found.

This issue was raised previously (https://github.com/rails/rails/issues/840) and confirmed as a bug, but I just noticed it is still broken in 3.0.9 - and the previous issue has been automatically closed. One of the gems that my app depends on is not compatible with 3.1 so I haven't been able to test if this issue has been resolved there. Any input much appreciated!  

