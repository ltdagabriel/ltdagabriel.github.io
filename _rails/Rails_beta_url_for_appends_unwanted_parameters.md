---
title: Rails5 beta3 url_for appends unwanted parameters
labels: actionpack, attached PR, regression
layout: issue
---

### Steps to reproduce

``` ruby
class ItemsController
  def update
    redirect_to({action: :index})
  end
  def index
    render plain: 'index'
  end
end
...
  def test_redirect
    patch(:update,{id:12})
    assert_redirected_to({action: :index})
    # fails with:
    # Expected response to be a redirect to <http://test.host/items?id=12> but was a redirect to <http://test.host/items>.

  end
```

see https://gist.github.com/mfazekas/922719bf65b3daeb7a0360e0ae7e7ebc for full repro script

was fine in rails 4.2
### Expected behavior

test should pass
### Actual behavior

id seems to be added to `assert_redirected_to :index`

```
  1) Failure:
ItemsControllerTest#test_redirect [test_rails_redirect.rb:61]:
Expected response to be a redirect to <http://test.host/items?id=12> but was a redirect to <http://test.host/items>.
Expected "http://test.host/items?id=12" to be === "http://test.host/items".
```
### System configuration

**Rails version**:5.0.0.beta3
**Ruby version**:2.3.0

