---
title: Default charset being appended even when content type is already set as parameter to render or head
labels: actionpack
layout: issue
---

After Rails 3.2 the Content-Type header is being appended with charset no matter if it was already set by render or head.

It works:
### controller

``` ruby
  headers["Content-Type"] = 'text/html; charset=utf-8'
  respond_to do |format|
    ...
    format.html  { head :not_found }
  end
```
#### rspec

``` ruby
  it { response.headers["Content-Type"].should == "text/html; charset=utf-8" }
```
#### result

```
  1 example, 0 failures
```

But it doesn't work:
### controller

``` ruby
  respond_to do |format|
    ...
    format.html  { head :not_found, content_type: "text/html; charset=utf-8" }
  end
```
#### rspec

``` ruby
  it { response.headers["Content-Type"].should == "text/html; charset=utf-8" }
```
#### result

```
  Failure/Error: it { response.headers["Content-Type"].should == "text/html; charset=utf-8" }
       expected: "text/html; charset=utf-8"
            got: "text/html; charset=utf-8; charset=utf-8" (using ==)
```

