---
title: Assets precompiling not respecting sprocket cache
labels: asset pipeline
layout: issue
---

It has occurred to me that Sprockets can use several caching strategies. The default one is filesystem, but others can be implemented easily.

Event rails is providing a (not documented) configuration setter to change the Sprocket caching (https://github.com/rails/rails/blob/a5589db063e0f527357f6be338adecf4716e6b47/actionpack/lib/sprockets/railtie.rb#L28).

However when looking at the pre compilation tasks, we see that Rails is not keeping this into account. It is just removing the temporary cache folder (https://github.com/rails/rails/blob/a5589db063e0f527357f6be338adecf4716e6b47/actionpack/lib/sprockets/assets.rake#L65).

Ideally the assets rake tasks should use a dedicated clear cache function, that will clear the Sprockets cache.

