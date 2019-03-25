---
title: Encoding::UndefinedConversionError with actionpack 4.2.x
labels: actionpack
layout: issue
---

I found Rails 4.2.x with Rack 1.6.x raises `Encoding::UndefinedConversionError` when the uploaded file has multibyte UTF-8 filename with "%" character.
I added a failing spec for it: https://github.com/eagletmt/rails/commit/b5ae1be2cd1aef2f6ed7a53a4684c6b7eb35304f .

The error is raised from here https://github.com/rails/rails/blob/4-2-stable/actionpack/lib/action_dispatch/http/upload.rb#L31 .
Rails expects `original_filename.encode 'UTF-8'` always succeeds, but when the filename is encoded with multibyte UTF-8 and contains "%" character, Rack returns ASCII-8BIT filename.
https://github.com/rack/rack/blob/1.6.4/lib/rack/multipart/parser.rb#L169-L171
`filename.scan(/%.?.?/).all? { |s| s =~ /%[0-9a-fA-F]{2}/ }` returns `false` in such situation.

The error isn't raised with Rails 4.1.x and Rack 1.5.x.

I'm not sure whether the issue is Rails' bug (i.e., the filename could be ASCII-8BIT) or Rack's bug (i.e., the filename must be UTF-8) .
@tenderlove any thoughts?

