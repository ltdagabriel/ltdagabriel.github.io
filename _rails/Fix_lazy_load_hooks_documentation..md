---
title: Fix lazy load hooks documentation.
labels: activesupport, attached PR, docs, good-first-patch
layout: issue
---

Active Support has long had load hooks in https://github.com/rails/rails/blob/39b8b8fdbf6c175a64f07198ff1c950e33c72cd0/activesupport/lib/active_support/lazy_load_hooks.rb, but since https://github.com/rails/rails/commit/7c90d91c3c43bdbba25d38589aed0e2940af3bc8 the docs stopped showing up on http://api.rubyonrails.org/files/activesupport/lib/active_support/lazy_load_hooks_rb.html.

Your mission, should you choose to accept it, is to fix this. We could wrap the file's behavior in a module and extend Active Support with it inline.

Then for good measure we should give the docs some housekeeping. Try coming up with a better explanation for why the lazy load hooks exist. Use this as a starting ground: https://github.com/rails/rails-controller-testing/issues/24#issuecomment-231827911

