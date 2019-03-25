---
title: request.fullpath behavior change in 4.1.6 -- no longer has leading /
labels: actionpack
layout: issue
---

for URL http://example.com/forums

`puts request.fullpath`

in Rails 4.1.5 => '/forum'
in Rails 4.1.6 => 'forum'

Looking at https://github.com/rails/rails/compare/v4.1.5...v4.1.6 its not obvious, but I think its https://github.com/rails/rails/issues/15511 that caused the change?

Trying to figure out an easy way to duplicate/test it -- I found it because we're using an old fork of ssl_requirement that users require.fullpath

