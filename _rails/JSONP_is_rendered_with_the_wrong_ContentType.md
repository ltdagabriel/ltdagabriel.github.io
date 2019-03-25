---
title: JSONP is rendered with the wrong Content-Type
labels: actionview
layout: issue
---

Chrome v35 and a few other browsers have started adding strict MIMEtype parsing for fetched resources, which is giving us grief as a padded JSON response (say, from `render json: my_obj, callback: 'parse'`), is being served with Content-Type `application/json` instead of `application/javascript`. This means the browser's security model will block the response from being executed:

![screen shot 2014-05-12 at 5 43 49 pm](https://cloud.githubusercontent.com/assets/139790/2952290/7155050a-da38-11e3-94ba-456b8723cb86.png)

