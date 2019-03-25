---
title: i18n fallback doesn't work for localized views
labels: actionview, i18n
layout: issue
---

_Imported from Lighthouse._ Original ticket at: http://rails.lighthouseapp.com/projects/8994/tickets/6411
Created by **Ola Tuvesson** - 2011-02-11 09:30:57 UTC

Given that I have set i18n to fall back (e.g. from "fr-Fr" to just "fr"): 

I18n::Backend::Simple.send(:include, I18n::Backend::Fallbacks)

And I have created a localized view (e.g. /help/index.fr.html.erb)

When i18n locale is set to "fr-FR", then the localized view is not found - yet the language file fr.yml is found. 

Can I monkey patch this somehow?

