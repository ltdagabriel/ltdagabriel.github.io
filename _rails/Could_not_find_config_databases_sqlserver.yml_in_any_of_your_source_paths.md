---
title: Could not find "config/databases/sqlserver.yml" in any of your source paths
labels: railties
layout: issue
---

It seems that the sqlserver database configuration has vanished?  Running the following under jruby (though I don't think the ruby matters), on rails 3.2.6:

```
rails new foo -d sqlserver
```

Yields the following output:

```
rails new foo -d sqlserver      create  
      create  README.rdoc
      create  Rakefile
      create  config.ru
      create  .gitignore
      create  Gemfile
      create  app
      create  app/assets/images/rails.png
      create  app/assets/javascripts/application.js
      create  app/assets/stylesheets/application.css
      create  app/controllers/application_controller.rb
      create  app/helpers/application_helper.rb
      create  app/mailers
      create  app/models
      create  app/views/layouts/application.html.erb
      create  app/mailers/.gitkeep
      create  app/models/.gitkeep
      create  config
      create  config/routes.rb
      create  config/application.rb
      create  config/environment.rb
      create  config/environments
      create  config/environments/development.rb
      create  config/environments/production.rb
      create  config/environments/test.rb
      create  config/initializers
      create  config/initializers/backtrace_silencers.rb
      create  config/initializers/inflections.rb
      create  config/initializers/mime_types.rb
      create  config/initializers/secret_token.rb
      create  config/initializers/session_store.rb
      create  config/initializers/wrap_parameters.rb
      create  config/locales
      create  config/locales/en.yml
      create  config/boot.rb
Could not find "config/databases/sqlserver.yml" in any of your source paths. Your current source paths are: 
/Users/sgonyea/.rbenv/versions/jruby-1.6.7.2/lib/ruby/gems/1.8/gems/railties-3.2.6/lib/rails/generators/rails/app/templates
```

