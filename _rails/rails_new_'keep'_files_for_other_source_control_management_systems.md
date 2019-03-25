---
title: rails new: 'keep' files for other source control management systems
labels: railties
layout: issue
---

As DDH recently said, one of the nicest things rails provides is empty folders. A place to put your stuff. The `rails new` command attempts to preserve these empty folders in git repositories by creating `.gitkeep` files, but git is not the only source control system that does not track empty folders. If you don't use git and opt to generate your app with the `--skip-git` option then you are on your own for adding your own keep files for these source control systems. Your other option is to generate the app, then immediately delete all copies of .gitignore, rename all .gitkeep files to something more appropriate for your scm, and then remove the .git directory.

I see a couple of potential solutions that I'd be willing to work on a patch for:

Solution A:
Add a `--keep-file=NAME` option that would add keep files with the specified name, even in the face of `--skip-git`

Solution B:
1. rename `.gitkeep` files to `.keep` to be SCM agnostic.
2. change `--skip-git` so that it still created `.keep` files.
3. added `--skip-keep` to skip the generation of `.keep` files
4. added `--skip-scm` to imply `--skip-git` and `--skip-keep`

Any thoughts on what the best way to proceed would be?

