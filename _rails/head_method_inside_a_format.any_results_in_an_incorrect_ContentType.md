---
title: head method inside a format.any results in an incorrect Content-Type
labels: With reproduction steps, actionpack, attached PR
layout: issue
---

### Steps to reproduce

In a controller's routed method:

```ruby
respond_to do |format|
  format.any  { head 404 }
end
```

then GET URI with a bogus extension, e.g. ```GET /1.foobar```

A full failing test example [here](https://gist.github.com/happycoloredbanana/3515bd8c6843b25fd2c686bd0a24b71a)

### Expected behavior
The response includes a ```Content-Type``` header that makes sense or no such header at all

### Actual behavior
```Content-Type``` that looks like this: ```#<Mime::NullType:0x00000009abcdef>```

### System configuration
**Rails version**: 5.0.2, 5.1.0

**Ruby version**: 2.4.1

