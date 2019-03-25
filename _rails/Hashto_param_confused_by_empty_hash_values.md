---
title: Hash#to_param confused by empty hash values
labels: activesupport
layout: issue
---

When to_param is used with empty hash values, it generates incorrect results.

``` ruby
> {}.to_param
""
```

Seems reasonable, but once nesting is introduced, this adds an extra ampersand at the start of the result.

``` ruby
> {c: 3, d: {}}.to_param
"&b%5Bc%5D=3"
> CGI::unescape _
"&b[c]=3"
```

With another level of nesting, the params aren't sorted lexicographically (which they should be according to the documentation).

``` ruby
> {a: 1, b: {c: 3, d: {}}}.to_param
"&b%5Bc%5D=3&a=1"
> CGI::unescape _
"&b[c]=3&a=1"
```

This is because `"&b[c]=3" < "a=1"`
## Expected Result

I'm uncertain how exactly to_param should behave in these cases.

It could either behave like nil

``` ruby
> CGI::unescape({a: 1, b: {c: 3, d: nil}}.to_param)
"a=1&b[c]=3&b[d]="
```

or behave as it does now (not adding any params), but not adding the extra ampersand

``` ruby
"a=1&b[c]=3"
```

If I could get some clarification on what the result should be I'd be happy to submit a pull request.

EDIT: Seems empty arrays also behave this way

