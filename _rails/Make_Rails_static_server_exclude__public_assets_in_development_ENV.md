---
title: Make Rails static server exclude /public/assets in development ENV
labels: asset pipeline
layout: issue
---

Pretty common pitfall for newbies in Sprockets. Everyone will get this error once. )

If you once run `rake assets:precompile` and then start rails in development mode your JS and CSS code will be included twice(with sprockets just-in-time generated and with precompiled application.js which is in public/assets). It looks very foggy to them, you can see all assigned DOM events are doubled - 2 alerts, 2 appends etc. Difficult to figure out what the problem is unless you stumbled upon this a lot of times.

Also it's not always a good way to make sure `rake assets:clean` - I don't want to remove stuff from public/assets, it will break my production installation! 

So, let's just stop looking up static stuff at "public/assets" when Rails.env.development?

Here is working patch for actionpack/lib/action_dispatch/middleware/static.rb

```
    def call(env)
      case env['REQUEST_METHOD']
      when 'GET', 'HEAD'

        path = env['PATH_INFO'].chomp('/')
        unless Rails.env.development? and path[0..7] == '/assets/'
          if match = @file_handler.match?(path)
            env["PATH_INFO"] = match
            return @file_handler.call(env)
          end
        end
      end

      @app.call(env)
    end
```

the change will allow to swap dev/prod environments immediately, without bothering about already precompiled assets and `rm -rf public/assets/*`

Of course it should be opt-out-able in development.rb and I need to refactor it in more ruby-way. 

What do you think about this? We will accomplish seamless working dev and prod environments + help guys who's new with asset pipeline :)

