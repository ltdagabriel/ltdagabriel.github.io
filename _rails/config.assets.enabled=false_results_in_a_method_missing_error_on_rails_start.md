---
title: config.assets.enabled=false results in a method_missing error on rails start
labels: asset pipeline
layout: issue
---

Steps to reproduce:

rails new my_site
...
open my_site/config/application.rb

Now edit "config.assets.enabled = true" to be false

Start the app with rails s

... boom:
active_support/whiny_nil.rb:48:in `method_missing': undefined method`context_class' for nil:NilClass (NoMethodError)
sass-rails-3.1.4/lib/sass/rails/railtie.rb:61:in `block in <class:Railtie>'
railties-3.1.1/lib/rails/initializable.rb:30:in`instance_exec'
railties-3.1.1/lib/rails/initializable.rb:30:in `run'
railties-3.1.1/lib/rails/initializable.rb:55:in`block in run_initializers'
railties-3.1.1/lib/rails/initializable.rb:54:in `each'

