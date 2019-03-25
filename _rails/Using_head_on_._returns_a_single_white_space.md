---
title: Using head on 4.2 returns a single white space
labels: actionpack
layout: issue
---

I'm upgrading our apps from 4.1 to 4.2 and ran in to something that surprised me a little bit while working on the API controllers. [According to the guides](http://guides.rubyonrails.org/layouts_and_rendering.html#using-head-to-build-header-only-responses), using `head` instead of `render :nothing` is considered more obvious, although the first returns a single space character while the latter does not as of #14883. 

Because the single space was introduced as a workaround for a bug, it seems unnecessary to keep it around for `head`?

