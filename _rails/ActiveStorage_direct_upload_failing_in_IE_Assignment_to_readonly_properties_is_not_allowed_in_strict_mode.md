---
title: ActiveStorage direct_upload failing in IE11 - Assignment to read-only properties is not allowed in strict mode
labels: activestorage
layout: issue
---

## Steps to reproduce
Using Active Storage, along with direct upload, upload a file directly to a service (tested with S3) using Internet Explorer 11.

## Expected behavior
The file should be properly uploaded via javascript directly to the service.

## Actual behavior
IE throws an error when the file upload is complete to S3 and the form submits:
```
Assignment to read-only properties is not allowed in strict mode
File: activestorage.self-*.js, Line: 1, Column: 3274
```
Which I tracked down to this line of code:

https://github.com/rails/rails/blob/f9ec3e5cc3753b7a46cc1a34d57ca941e4cf7211/activestorage/app/javascript/activestorage/ujs.js#L62

I'm still wrapping my head around this code but it seems to me as though the form is being modified after it's submitted, and IE doesn't like it. I'm happy to help correct it if someone can point me in the direction.

**System configuration**
Rails version:
5.2.0rc2

**Ruby version**:
ruby 2.5.0
