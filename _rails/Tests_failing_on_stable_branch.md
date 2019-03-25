---
title: Tests failing on 3-2-stable branch
labels: needs feedback, railties
layout: issue
---

I started a rails-dev-box, cloned github.com/rails/rails, did a `git -b fix_my_issue_branch remotes/origin/3-2-stable` and ran `rake test` in the actionpack directory. 5 tests failed and there were 2 errors. Had to run and not at my computer at the moment to report the exact tests or causes, but shouldn't all the tests pass on a fresh clone and rails-dev-box? The sqlite3 tests passed perfectly (I ran those first actually).

I'm ready to contribute a bug fix, but I want to make sure tests pass.

