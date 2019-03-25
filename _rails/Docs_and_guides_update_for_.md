---
title: Docs and guides update for #17573
labels: actionpack, attached PR, docs
layout: issue
---

With #17573, Rails will only generate "weak" etags. We need the following changes to go with that PR:
- [x] Mention this as a (minor) breaking change in the 5.0 release notes (and upgrade guides?)
- [x] Go through the guides and docs to see if anything needs to be updated
- [x] Document how to override this behavior (and add a test, probably)
- [x] Nice to have: briefly explain the difference between strong and weak etags (probably just a sentence or two with links to external resources), any gotchas and how to customize this behavior

Most of these are fairly easy; please feel free to grab and work on these items!

