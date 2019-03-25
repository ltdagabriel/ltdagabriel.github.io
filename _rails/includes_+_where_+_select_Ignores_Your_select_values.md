---
title: includes + where + select Ignores Your select_values
labels: activerecord
layout: issue
---

If you have a query that uses `includes` and `select` and a `where` call that limits based on the included table, whatever you put in the `select` call will be lost.

In accordance with the prophecy--I mean contribution guidelines, I [made a gist](https://gist.github.com/benhamill/6162089) to illustrate the issue.

I also made a [much more involved project](https://github.com/benhamill/ar_include_test#whats-up-with-includes) with a pry console that explains things, so that you can easily play with it.

First: others are seeing this, too, right?
Second: Does anyone have any guidance on where I could start looking to figure out why this is happening?

