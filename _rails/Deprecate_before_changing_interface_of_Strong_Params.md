---
title: Deprecate before changing interface of Strong Params
labels: actionpack
layout: issue
---

For Rails 5 strong params was changed to not inherit from hash. I think that's a great idea, however...we didn't deprecate the change (did we?). I think we should add a method missing that will send to the underlying hash and issue a deprecation before we remove the method missing and deprecation in 5.1.

This sudden change bit me on codetriage when upgrading.

cc/ @nateberkopec @sikachu

