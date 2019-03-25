---
title: ActiveStorage unable to render attachment URLs across subdomains
labels: activestorage
layout: issue
---

I am developing a mutli-subdomain application, and because of that I utilize `lvh.me` as my host to be able to navigate those subdomains locally. 

As of 6fb3ac1536d60bc12cf531e83e4060fe1fdf3d87 on the ActiveStorage Disk service, the host was defaulted to `localhost:3000` which forces me to set the **host:** setting in my `config/storage.yml`
```yml
local:
  service: Disk
  root: <%= Rails.root.join("storage") %>
  host: http://lvh.me:5000
```

I would expect that attached images would be able to look at the current environment's server and build the url from there. I would expect that if I upload an image on `admin.lvh.me:5000`, it would be able to render on `lvh.me:5000`

Because I have to explicity set the host, the generated image urls are only available on the subdomain I specify in the `config/storage.yml`

With the configuration as seen above, when I am on the `admin` subdomain I receive this error when displaying an attached image

<img width="631" alt="screen shot 2018-02-27 at 12 14 18 pm" src="https://user-images.githubusercontent.com/9326912/36749427-ed862efa-1bb7-11e8-978e-71a33ecaf2a5.png">

Without anyway to dynamically set that ActiveStorage url host, I'm not sure how to get around this issue.

**Ruby:** 2.4.2
**Rails:** 5.2.0.rc1

