---
title: undefined method `content_tag' in translation_helper
labels: actionview
layout: issue
---

translation_helper:55 incorrectly references tag_helper's `content_tag` and fails if translation_helper is loaded but not tag_helper.

Gemfile:

```
source 'https://rubygems.org'
gem 'rails', '3.2.16'
gem 'sqlite3'
```

rails console:

```
> include ActionView::Helpers::TranslationHelper
=> Object 
> t 'a string'

NoMethodError: undefined method `content_tag' for main:Object
from /Users/aghull/.rvm/gems/ruby-1.9.3-p448/gems/actionpack-3.2.16/lib/action_view/helpers/translation_helper.rb:55:in `rescue in translate'
....
```

The issue was introduced in 3.2.16. It does not affect 4.0.1 where the same change was introduced and I'm not sure why. The translation_helper.rb just does a require for tag_helper.rb but doesn't actually include or extend it. The issue can be resolved by placing anywhere at startup, e.g. config/environment.rb:

```
module I18n
  extend ActionView::Helpers::TagHelper
end
```

But this doesn't seem like the correct fix.

