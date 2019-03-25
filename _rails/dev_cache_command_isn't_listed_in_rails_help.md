---
title: dev:cache command isn't listed in rails --help
labels: attached PR, railties
layout: issue
---

Easiest fix is to add a line to `ADDITIONAL_COMMANDS` in `railties/lib/rails/commands/commands_tasks.rb`.  I'm happy to submit a PR for that.

However, this seems like a short-term fix...  Is there any reason Rails commands don't self-document the way Rake tasks do?  (It seems odd that all Rake tasks -- but not all Rails commands -- are listed in `rails --help`.)

I can submit a more comprehensive PR to move documentation into the individual commands if desired.  It seems like this was the original intention of `set_banner` in https://github.com/rails/rails/commit/2ddb5997108c4612dd96747fb082ba7f93427a31.

