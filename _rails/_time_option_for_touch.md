---
title: `:time` option for `#touch`
labels: openacademy
layout: issue
---

`#touch` always uses the current time. If we want to touch with a different time, we have to do it ourselves. That makes it awkward to touch a record to match another record, to touch a record with current transaction time, to touch with an associated file's mtime, or to touch with a previous time reflecting an earlier occurrence.

We can take an optional `time:` argument that defaults to `current_time_from_proper_timezone` to make these cases possible.

