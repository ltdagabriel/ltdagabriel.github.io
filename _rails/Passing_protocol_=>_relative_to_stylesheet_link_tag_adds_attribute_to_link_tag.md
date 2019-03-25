---
title: Passing :protocol => :relative to stylesheet_link_tag adds attribute to link tag
labels: actionpack
layout: issue
---

On Rails 3.2.9, Passing :protocol => :relative to stylesheet_link_tag adds an attribute to the link rather than forcing a relative path on the url. Without a way to force relative protocols I experience unexpected behavior when caching pages that are accessible through http and https.

application.html.erb (layout)

``` erb
<%= stylesheet_link_tag    "manifest_application", "manifest_home", :protocol => :relative %>
<%= javascript_include_tag "manifest_application", "manifest_home" %>
```

learn_more.html

``` html
<link href="https://subdomain.cloudfront.net/assets/manifest_application-digest.css" media="screen" protocol="relative" rel="stylesheet" type="text/css" />
<link href="https://subdomain.cloudfront.net/assets/manifest_home-digest.css" media="screen" protocol="relative" rel="stylesheet" type="text/css" />
```

