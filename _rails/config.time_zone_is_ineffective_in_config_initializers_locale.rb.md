---
title: `config.time_zone` is ineffective in `config/initializers/locale.rb`
labels: railties
layout: issue
---

I believe that 185c0209961dc0caac4e53383b7d173d69ec5911 doesn't quite work (cc: @steveklabnik)

`Time.zone`'s default is set in [`ActiveSupport`'s railtie](https://github.com/rails/rails/blob/c9d8481bebe55d8073256391e4f828cb2c8c3849/activesupport/lib/active_support/railtie.rb#L20). However, at that point in the app's boot process, code in `config/initializers/locale.rb` will _not_ have been run.

I've created a new Rails 4 application that demonstrates the problem. There is one test in the application and it's currently failing: https://github.com/alindeman/timezone_in_locale_rb. The only code changed from the generated application is shown in https://github.com/alindeman/timezone_in_locale_rb/commit/01ed96e2f215f40f4ddf9a6a017aa26aa7c3ea5a.

