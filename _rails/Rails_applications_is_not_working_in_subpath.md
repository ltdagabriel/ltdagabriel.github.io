---
title: Rails applications is not working in sub-path
labels: actionpack
layout: issue
---

Hi,

I'm trying to deploy my rails application work in a sub-path but it is not working.

Some places says to use `RAILS_RELATIVE_URL_ROOT` environment variable but it seems to be ignored.

I started the server:

```
λ RAILS_RELATIVE_URL_ROOT='/relative' bundle exec rails server puma -p 9292
```

And checked the routes with curl:

```
λ curl -s localhost:9292/relative/people | grep 'No route matches' || echo 'ok!'
<p><pre>No route matches [GET] &quot;/relative/people&quot;</pre></p>

λ curl -s localhost:9292/people | grep 'No route matches' || echo 'ok!'
ok!
```

Then I found other posts saying to scope the entire routes.rb file like that:

``` ruby
Myapp::Application.routes.draw do
  scope ENV['RAILS_RELATIVE_URL_ROOT'] do
    ...
  end
end
```

Then the routes starts to work:

```
λ curl -s localhost:9292/people | grep 'No route matches' || echo 'ok!'
<p><pre>No route matches [GET] &quot;/people&quot;</pre></p>

λ curl -s localhost:9292/relative/people | grep 'No route matches' || echo 'ok!'
ok!
```

But the devise redirect goes wrong (maybe it's devise/warden fault, I didn't checked yet):

```
curl -s localhost:9292/relative/people 
<html><body>You are being <a href="http://localhost:9292/relative/relative/users/sign_in">redirected</a>.</body></html>
```

At this point I can access on browser to workaround this redirect issue but the assets do not work anymore since it is:

```
<link href="/relative/assets/application.css" media="screen" rel="stylesheet" type="text/css" />
```

And the sprockets route is mounted on `/assets` instead of `/relative/assets`:

```
λ curl -s localhost:9292/relative/assets/application.css | grep 'No route matches' || echo 'ok!'
<p><pre>No route matches [GET] &quot;/relative/assets/application.css&quot;</pre></p>

λ curl -s localhost:9292/assets/application.css | grep 'No route matches' || echo 'ok!'
ok!
```

Another posts says to change the `config.ru` like that:

``` ruby
map ENV['RAILS_RELATIVE_URL_ROOT'] do
  run Myapp::Application
end
```

But the redirect is still wrong:

```
curl -s localhost:9292/relative/relative/people 
<html><body>You are being <a href="http://localhost:9292/relative/relative/users/sign_in">redirected</a>.</body></html>
```

I can workaround that route issue again on browser and authenticate and the assets is served.

But at this point, calling `image_path` inside a css+erb stylesheet returns a wrong value:

``` ruby
image_path 'logo.png'
```

Returns:

```
/assets/logo.png
```

Since the sprockets is serving on `/relative/assets`, it won't work.

But calling `image_path` on rails views returns the right value:

```
/relative/assets/logo.png
```

At this point, I removed the scope from routes and kept the map on config.ru.

Then devise redirect worked:

```
λ curl -s localhost:9292/relative/people 
<html><body>You are being <a href="http://localhost:9292/relative/users/sign_in">redirected</a>.</body></html>
```

The stylesheet route was generated right:

``` html
<link href="/relative/assets/application.css" media="screen" rel="stylesheet" type="text/css">
```

But the image_path inside the stylesheet is still using `/assets/logo.png` instead of  `/relative/assets/logo.png`.

I found another place saying to use `config.assets.prefix` like that:

``` ruby
config.assets.prefix = '/relative'
```

But at this point, the sprockets route changed from `/relative/assets/application.css` to `/relative/relative/assets/application.css` and the `image_path` is still using `/assets/logo.png`.

That do not make any sense for me because `RAILS_RELATIVE_URL_ROOT` is set, the `run Myapp::Application` is inside a map using the same value and `config.assets.prefix` have this same value.
#2977 and #3365 seems to fix this issue so I think it's a regression.

