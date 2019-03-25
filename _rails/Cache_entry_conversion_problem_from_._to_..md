---
title: Cache entry conversion problem from 3.2 to 4.1
labels: activesupport
layout: issue
---

I'm having a problem with cache data upgrading an app from 3.2 to 4.1. 

Under 3.2 a cache Entry's value might be a hash as follows:

```
$ rails console
Loading development environment (Rails 3.2.21)
2.1.5 :001 > Rails.cache.write('my_key', {a:1})
 => true
2.1.5 :002 > Rails.cache.read('my_key')
 => {:a=>1}
```

Under 4.1 this is being returns as a string:

```
$ rails console
Loading development environment (Rails 4.1.8)
2.1.5 :001 > Rails.cache.read('my_key')
 => "\x04\b{\x06:\x06ai\x06"
```

This seems to me to be related to the fact that under Rails 4 we no longer `Marshal.load` the data that was `Marshal.dump`ed into the cache Entry in Rails 3. See [this commit](https://github.com/rails/rails/commit/e3a746b6fc4a67986c0510dfe50ca064d90d5f37#diff-438394335b9c1ce6ec4f67a407f50a42L585) lines L585 vs R562.

I see the discussion in #9494 about conversion issue, although I'm not sure I follow all of it. I notice that at several points there's discussion about having to rebuild the cache but there's no discussion of a breaking change to the cache in the upgrade Guide. Is cached data not expected to be portable?

I have created [an example repository](https://github.com/jeremywadsack/cache-marshal-test) that you can clone and reproduce the issue using the built-in file-system store. Instructions to reproduce this are in the README.

