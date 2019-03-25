---
title: changing ActionController::Parameters#to_h was a desaster
labels: actionpack
layout: issue
---

I updated rails (from 4.x to 4.2.3)
I believe ActionController::Parameters#to_h was changed.

That change was a real desaster for my code.
It broke about every assumption.

I fully understand why this is a good and valuable change.
But for my code it just broke quite everything.
And such breaking change should not be done in a minor version update.

I tried to change my code to use #to_unsafe_h,
but this is quite different to the old #to_h

The old #to_h did return a deep hash of indifferent access,
while #to_unsafe_hash returns a plain hash (with string keys)
(again, this is a good change in the end)

But all my code did access the hash with symbols,
even down to the second level (aka {a:{b:'foo'}}
and this broke with the new implementation.

I'd like suggest a better way for handling such changes:
- the old method should have stayed but should have complained: 'will change'
- instead of changing #to_h, a new method: #to_safe_h should have been introduced
- a new method #to_legacy_h should have been provided, replicating the semantics of the old #to_h
  thereby easying the transition of legacy code.

I could also imagine to use some feature flags to ease transition.
That should probably be opt-in for new breaking changes at the minor versions,
but should turn into opt-out flags for the next version.
(if not explicitely set, it should be default, aka new)

Change is good. I'm fully with this.
But this time it did break my things really hard.
I believe this is something that we do have to address.

