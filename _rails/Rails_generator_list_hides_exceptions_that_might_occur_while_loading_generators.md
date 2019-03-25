---
title: Rails generator list -- hides exceptions that might occur while loading generators
labels: railties
layout: issue
---

Today I was creating a generator for a Rails 3.1.3 application and when I ran "rails g" I didn't see it listed. After a little while digging around I realized I had a syntax error in my generator (I forgot to put an "end" to close a method definition).

I then dug into Rails to find out where the code lives for listing the available generators and I found in the [generators](https://github.com/rails/rails/blob/master/railties/lib/rails/generators.rb#L301) railtie. Specifically the "lookup!" method.

Notice it tries to require the generators, if an exception occurs it silently ignores it. As a developer, who makes mistakes and didn't have tests for my generator, I would have loved if Rails would have logged a warning when listing the generators.

I'm forking Rails now to offer a potential solution.

